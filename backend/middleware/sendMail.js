import nodemailer from 'nodemailer';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mathewanto.19@gmail.com', // Your email address
        pass: 'ivpv squl vifh onef' // Your email password or application-specific password
    }
});

// Function to send emails
export const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'mathewanto.19@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email: ', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
};