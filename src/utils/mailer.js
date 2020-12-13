const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;

console.log(host,
port,
user,
pass
)

module.exports =  (email) => {
    let transporter = nodemailer.createTransport({host, port, secure: true, auth: {user, pass}});

    // TODO: add the dynamic message;

    // send mail with defined transport object
    return  transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email, // list of receivers
        subject: "Invitation to join the Picsart booking", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
}