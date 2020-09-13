const nodemailer = require('nodemailer');
const environment = require('../../infrastructure/config/environment.js');

const transporter = nodemailer.createTransport({
  service: environment.mail.service,
  auth: {
    user: environment.mail.user,
    pass: environment.mail.password,
  },
});

const mailTemplate = (to, subject, html) => ({
  from: environment.mail.user,
  to,
  subject,
  html,
});

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error /* info */) => {
    if (error) {
      return false;
    }
    return true;
  });
}

module.exports = async (to, subject, content) => {
  const mail = mailTemplate(to, subject, content);
  sendEmail(mail);

  return true;
};
