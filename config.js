require('dotenv').config(); 
module.exports = {
    run: {
        generateCertificates: true,
        sendEmails: true
    },
    paths: {
        template: './data/template.pdf',
        csv: './data/data.csv',
        font: './data/font.ttf',
        outputDir: './output/'
    },
    email: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
};