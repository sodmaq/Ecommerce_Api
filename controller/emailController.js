const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP server
    port: 465, // SMTP port for secure connection
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID, // Your email address
      pass: process.env.MAIL_PASSWORD, // Your email password or App password for Gmail
    },
  });

  const mailOptions = {
    from: 'Yekini Sodiq <sodmaq@gmail.com>', // Sender's name and email address
    to: options.email, // Recipient's email address
    subject: options.subject, // Email subject
    text: options.message, // Plain text body
    html: `<p>${options.message}</p>`, // HTML body
    // Additional email options such as attachments, cc, bcc, etc., can be added here if needed
  };

  // Send email using the transporter
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
