// send a registration success email to the user
import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY,
    })
);

const sendEmail = async (emailID, subject, text, html) => {
    try {
        const mailOptions = {
            from: 'alencolins@gmail.com',
            to: emailID,
            subject: subject,
            text: text,
            html: html,
        };
        await transporter.sendMail(mailOptions).then((response) => {
            // check if the email was sent
            console.log("Email sent successfully");
        }).catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;

