const nodemailer = require('nodemailer');

module.exports = function(){
    console.log('hello')
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
        to: 'jrdunkley@sky.com', // listed in rfc822 message header
        envelope: {
            from: 'JRDunkley <jdun101@gmail.com>', // used as MAIL FROM: address for SMTP
            to: 'jrdunkley@sky.com, Mailer <jrdunkley@sky.com>' // used as RCPT TO: address for SMTP
        },
        text: 'This is my new message'
    }
    var smtpTransport = nodemailer.createTransport(smtpConfig);
    smtpTransport.sendMail(message, function(error, response){
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    });
};