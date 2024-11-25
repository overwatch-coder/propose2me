const nodemailer = require("nodemailer");
const { shortenUrl: shortenUrlLink } = require("shaveurl");

// Send email
const sendUserEmail = async (recipient, subject, content) => {
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    service: "gmail",
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `PTM <${process.env.NODEMAILER_USER}>`, // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    html: content, // html body
  });

  const messageId = info.messageId;

  return messageId;
};

// generate a shortened url
const shortenUrl = async (urlToShorten, title, expiry) => {
  try {
    const url = await shortenUrlLink(urlToShorten);

    const results = {
      status: true,
      data: {
        link: url || urlToShorten,
      },
      message: "Shortened URL generated successfully",
    };

    return results;
  } catch (error) {
    console.log({ error, in: "catch" });
    return error;
  }
};

module.exports = {
  sendUserEmail,
  shortenUrl,
};
