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
   try {
     transporter.sendMail({
         to: mailOptions.to,
         subject : mailOptions.subject,
         html : mailOptions.html
     })
   } catch (error) {
    console.log("error in send email in utils folder",error);
   }
};

const isEmailValid = async (securityOptions) => {
    try {
        transporter.sendMail({
            to : securityOptions.to,
            subject : securityOptions.subject,
            html : securityOptions.html
        });
    } catch (error) {
        console.log("error in security email in utils folder",error);
    }
}

module.exports = {sendMail, isEmailValid};