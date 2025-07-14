const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure : true,
    host : "smtp.gmail.com",
    port : 465,
    auth : {
        user : process.env.USER,
        pass : process.env.PASS
    }
});

const sendMail = async (mailOptions) => {
    transporter.sendMail({
        to: mailOptions.to,
        subject : mailOptions.subject,
        html : mailOptions.html
    })
};

module.exports = sendMail;