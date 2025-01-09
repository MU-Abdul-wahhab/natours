const { text } = require('express');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth : {
            user: process.env.GMAIL_USER_NAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });


    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USER_NAME,
    //         password: process.env.EMAIL_PASSWORD
    //     }
    // });

    const mailOptions = {
        from : 'abdulwahhab200547@gmail.com',
        to : options.email,
        subject : options.subject,
        text : options.message

    };

   await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;