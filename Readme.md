<div align="center">

# Certificate Generator Automation System

Automated PDF certificate generation and bulk email dispatch for events.

Originally built for **Codefied 26.1** by the **Knuth Programming Hub (JIIT)**, this project is designed as a modular, configurable, and reusable pipeline for any organization.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## Features

- Generate personalized PDF certificates from a CSV dataset.
- Send certificates directly as email attachments using Nodemailer.
- Embed custom TrueType (`.ttf`) fonts into certificates.
- Fine-tune text placement using configurable X and Y offsets.
- Modular architecture with separate execution, configuration, and styling layers.
- Automatically sanitize filenames and prevent duplicate file overwrites.
- Stream large CSV files efficiently using `fs.createReadStream()`.
- Load templates and fonts only once to minimize memory usage.
- Built-in delay between emails to reduce SMTP rate-limit issues.
- Dry-run mode for safely testing certificate generation before sending emails.
- Secure credential management using environment variables.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| pdf-lib | PDF generation and editing |
| @pdf-lib/fontkit | Custom font embedding |
| csv-parser | Streaming CSV parser |
| Nodemailer | Email delivery |
| dotenv | Environment variable management |

---

## Project Structure

```text
.
├── data/
│   ├── template.pdf          # Certificate template
│   ├── data.csv              # Participant data
│   └── font.ttf              # Custom font
│
├── output/                   # Generated certificates
│
├── config.js                 # Runtime configuration
├── setup.js                  # Styling and email configuration
├── index.js                  # Main application
│
├── .env.example
├── package.json
└── README.md
```

---

## Prerequisites

Before getting started, ensure you have:

- Node.js **v18** or later
- npm
- A Gmail account
- Google **App Password** (requires 2-Step Verification)

> **Note:** Gmail no longer allows regular account passwords for SMTP authentication. An App Password is required.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/certificate-generator.git
cd certificate-generator
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Update `.env`:

```env
EMAIL=your_email@gmail.com
APP_PASSWORD=your_16_character_app_password
```

---

## Preparing Your Data

Place the following files inside the `data/` directory:

```text
data/
├── template.pdf
├── font.ttf
└── data.csv
```

Your CSV should contain at least the following columns:

| Name | Email |
|------|-------|
| John Doe | john@example.com |
| Jane Doe | jane@example.com |

---

## Configuration

### `config.js`

Control the execution flow using feature toggles.

### Dry Run

Generate certificates without sending emails.

```javascript
module.exports = {
    run: {
        generateCertificates: true,
        sendEmails: false
    }
};
```

### Email Existing Certificates

```javascript
module.exports = {
    run: {
        generateCertificates: false,
        sendEmails: true
    }
};
```

### Full Automation

```javascript
module.exports = {
    run: {
        generateCertificates: true,
        sendEmails: true
    }
};
```

---

## Certificate Customization

Certificate styling is managed through `setup.js`.

You can customize:

- Font family
- Font size
- Text color
- X offset
- Y offset
- Certificate layout
- Email subject
- Email body

This allows the project to work with virtually any certificate template.

---

## Running the Project

Execute the application:

```bash
node index.js
```

The workflow is:

1. Read participant data from the CSV file.
2. Generate personalized PDF certificates.
3. Save certificates to the `output/` directory.
4. Send emails (if enabled).

---

## Performance

### Efficient CSV Processing

The participant list is streamed using `fs.createReadStream()`, allowing the application to process large datasets without loading the entire CSV into memory.

### Asset Caching

The certificate template and font are loaded once before processing begins, reducing disk I/O and improving execution speed.

### Rate-Limited Email Dispatch

Emails are sent sequentially with a built-in delay between requests, reducing the likelihood of SMTP throttling or spam detection.

---

## Security

Sensitive credentials are stored using environment variables.

The `.env` file is intentionally excluded from version control.

Example:

```env
EMAIL=your_email@gmail.com
APP_PASSWORD=your_app_password
```

A `.env.example` file is included to simplify setup for new users.

---

## Output

Generated certificates are saved in:

```text
output/
├── Alice_Smith_1_Certificate.pdf
├── Bob_Jones_1_Certificate.pdf
├── Charlie_Brown_1_Certificate.pdf
└── ...
```

Duplicate participant names are automatically handled by appending a unique counter to each filename.

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Commit your changes.

```bash
git commit -m "Add my feature"
```

4. Push your branch.

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.