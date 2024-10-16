const nodemailer = require("nodemailer");
const shortUrl = require("node-url-shortener");

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
    const url = await new Promise((resolve, reject) => {
      shortUrl.short(urlToShorten, (err, shortenedUrl) => {
        if (err) {
          process.env.NODE_ENV === "development" && console.log(err);
          reject({
            status: false,
            message: "Unexpected error encountered. Try again later",
            error: process.env.NODE_ENV !== "production" ? err : null,
          });
        } else {
          resolve(shortenedUrl);
        }
      });
    });

    const results = {
      status: true,
      data: {
        link: url,
      },
      message: "Shortened URL generated successfully",
    };

    console.log({ results, in: "final" });
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
