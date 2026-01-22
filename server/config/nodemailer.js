import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT, // 587
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },

  // --- RENDER DEPLOYMENT FIXES ---
  logger: true, // Logs the SMTP handshake to your Render console
  debug: true, // Includes low-level debug info in logs

  // 1. Force IPv4 (Fixes network hanging on some cloud containers)
  family: 4,

  // 2. Timeout Settings (Prevents hanging indefinitely)
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
  dnsTimeout: 10000, // 10 seconds
});

export default transporter;
