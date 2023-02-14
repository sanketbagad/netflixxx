// send a registration success email to the user
import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: "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",
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

