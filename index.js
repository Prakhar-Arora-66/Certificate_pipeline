const fs = require('fs');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const config = require('./config.js');
const setup = require('./setup.js');

async function runSystem() {
    console.log('Initializing...');

    // 1. Setup Output Directory & Transporter
    if (!fs.existsSync(config.paths.outputDir)){
        fs.mkdirSync(config.paths.outputDir);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });

    const participants = [];

    fs.createReadStream(config.paths.csv)
        .pipe(csv())
        .on('data', (row) => participants.push(row))
        .on('end', async () => {
            console.log(`${participants.length} entries in data.csv`);

            
            let templateBytes, fontBytes;
            if (config.run.generateCertificates) {
                templateBytes = fs.readFileSync(config.paths.template);
                fontBytes = fs.readFileSync(config.paths.font);
            }

            let counter=1;
            for (const person of participants) {
                const columns = Object.values(person);
                const name = (columns[0] || '').trim();
                const email = (columns[1] || '').trim();
                
                if (!name) continue;

                const fileName = `${name.replace(/\s+/g, '_')}_${counter}_Certificate.pdf`;
                const filePath = `${config.paths.outputDir}${fileName}`;

                try {
                    if (config.run.generateCertificates) {
                        const pdfDoc = await PDFDocument.load(templateBytes);
                        pdfDoc.registerFontkit(fontkit);
                        const customFont = await pdfDoc.embedFont(fontBytes);
                        const firstPage = pdfDoc.getPages()[0];

                        const textWidth = customFont.widthOfTextAtSize(name, setup.design.fontSize);
                        const xPos = (firstPage.getWidth() / 2) - (textWidth / 2)+setup.design.xOffset;
                        const yPos = (firstPage.getHeight() / 2) + setup.design.yOffset;

                        firstPage.drawText(name, {
                            x: xPos,
                            y: yPos,
                            size: setup.design.fontSize,
                            font: customFont,
                            color: rgb(setup.design.color.r, setup.design.color.g, setup.design.color.b),
                        });

                        const pdfBytes = await pdfDoc.save();
                        fs.writeFileSync(filePath, pdfBytes);
                        console.log(`PDF Created: ${fileName}`);
                    }

                    // --- PHASE B: SEND EMAIL ---
                    if (config.run.sendEmails) {
                        if (!fs.existsSync(filePath)) {
                            console.error(`Cannot email ${name}: PDF not found at ${filePath}`);
                            continue;
                        }

                        await transporter.sendMail({
                            from: `"Event Team" <${config.email.user}>`,
                            to: email,
                            subject: setup.message.subject,
                            text: setup.message.body(name),
                            attachments: [{ filename: fileName, path: filePath }]
                        });
                        console.log(`Emailed to: ${email}`);
                        
                        // Prevent rate-limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                } catch (error) {
                    console.error(`Error processing ${name}:`, error);
                }   
            }
            console.log('\nDone!');
        });
}

runSystem();