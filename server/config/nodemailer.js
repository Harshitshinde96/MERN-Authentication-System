import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // smtp-relay.brevo.com
  port: 2525, // 587 or 2525
  secure: false, 
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  // --- ADD THESE LINES TO FORCE LOGS ---
  logger: true,
  debug: true,
});

export default transporter;