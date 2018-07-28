const nodemailer = require('nodemailer');

module.exports = function(Email, Token){

    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'jdun101@gmail.com',
            pass: 'gokuhson3A'
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    let message = {
        from: 'jdun101@gmail.com', // listed in rfc822 message header
        to: Email, // listed in rfc822 message header
        subject: 'Fitness App Activation code',
        envelope: {
            from: 'JRDunkley <jdun101@gmail.com>', // used as MAIL FROM: address for SMTP
            to: Email + ', Mailer <' + Email + '>' // used as RCPT TO: address for SMTP
        },
        text: Token,
        html: '<a href="http://localhost:8000/users/verify/' + Token + '">Activation Link</a>'
    }
    var smtpTransport = nodemailer.createTransport(smtpConfig);
    smtpTransport.sendMail(message, function(error, response){
        if(error){
            ;
        }else{
            console.log('Mail has been sent');
        }
    });
};