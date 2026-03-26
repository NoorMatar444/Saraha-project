import { createTransport } from "nodemailer";
import { MAIL_PASS, MAIL_USER } from './../../../config/config.service.js';


const transporter = createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  },
});

async function sendMail({ to, subject, text, html, attachments }) {
    const info = await transporter.sendMail({
    from: `Route <${MAIL_USER}>`, // sender address
    to,// list of recipients
    subject, // subject line
    text, // plain text body
    html, // HTML body
  });

  console.log("Email sent: %s", info.messageId);
}


export default sendMail