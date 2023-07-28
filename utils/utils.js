const jwt = require("jsonwebtoken");
const { createTransport } = require("nodemailer");

exports.createToken = (userId) =>
  jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.EXPIRE_DATE,
  });

exports.sendEmail = async (options) => {
  const transporter = createTransport({
    host: process.env.HOST,
    port: process.env.port,
    secure: process.env.secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailerOptions = {
    from: "White shop <ibraheemelfakharany@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.content,
  };

  await transporter.sendMail(mailerOptions);
};
