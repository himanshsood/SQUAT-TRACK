const { createTransport } = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config(); 

const sendMail = async (email, message) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;

  try {
    await transport.sendMail({
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // Email address to receive the contact form messages
      subject: "New Contact Form Submission",
      html,
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email sending failed");
  }
};

module.exports = sendMail;
