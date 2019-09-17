const nodemailer = require('nodemailer');

// require bunyan for logging errors to file
const log = require('../config/logger').logger;

let EMAIL = process.env.EMAIL;
let EMAIL_PASSWD = process.env.EMAIL_PASSWD;
let WEB_ADDRESS_ROOT = process.env.WEB_ADDRESS_ROOT;

module.exports = function (Email, Token) {

    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: EMAIL,
            pass: EMAIL_PASSWD
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    let message = {
        from: EMAIL, // listed in rfc822 message header
        to: Email, // listed in rfc822 message header
        subject: 'Fitness App Activation code',
        envelope: {
            from: "Fitness App <" + EMAIL + ">", // used as MAIL FROM: address for SMTP
            to: Email + ', Mailer <' + Email + '>' // used as RCPT TO: address for SMTP
        },
        text: Token,
        html: "Please click here on the <a href=" + WEB_ADDRESS_ROOT + "/api/verify?activation_link=" + Token +
            ">Activation Link</a> for verification of this email address. Once clicked your account will be activated."
    };
    let smtpTransport = nodemailer.createTransport(smtpConfig);
    smtpTransport.sendMail(message, function (error) {
        if (error) {
          log.info(error);
        }
        else {
          log.info("Activation email sent to: ", Email);
        }
    });
};
