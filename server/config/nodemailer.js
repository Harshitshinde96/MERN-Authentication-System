import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  // --- HARDCODED SETTINGS (To rule out Env Var errors) ---
  port: 465,
  secure: true,

  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },

  // --- NETWORK FIXES FOR RENDER ---
  // 1. Force IPv4: This is the #1 fix for hanging connections
  family: 4,

  // 2. Increase Timeouts: Give the server 30s instead of 10s
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  // 3. Debugging: Keep logs on so we can see what happens
  logger: true,
  debug: true,
});

export default transporter;
