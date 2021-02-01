const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;

module.exports = (email) => {
  const transporter = nodemailer.createTransport({
    host, port, secure: true, auth: { user, pass },
  });

  // TODO: add the dynamic message;

  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email, // list of receivers
    subject: 'Invitation to join the Picsart booking', // Subject line
    text: '', // plain text bodya
    html: '<div><b>Hey! you have been invited to join Picsart booking app please follow the link below </b><br/><a href="https://picsart-academy-ui.herokuapp.com/signin" >Click here<a/></div>', // html body
  });
};
