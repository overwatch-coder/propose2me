const nodemailer = require("nodemailer");

const sendUserEmail = async (recipient, subject, content) => {
    let transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      service: 'gmail',
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
}

module.exports = {
    sendUserEmail
}
