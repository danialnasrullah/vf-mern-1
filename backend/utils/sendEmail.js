// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter using Ethereal credentials
  //    (Get these from your Ethereal account page)
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'marlee.bayer@ethereal.email',
        pass: 'Q7QHnZKu8gvZNPgZtn'
    }
    });

  // 2) Define the email options
  const mailOptions = {
    from: '"Your App Name" <yourapp@example.com>', // Sender address
    to: options.email,                             // List of receivers (from function argument)
    subject: options.subject,                      // Subject line (from function argument)
    text: options.message,                         // Plain text body (from function argument)
    // html: '<b>Hello world?</b>'                 // You can also send HTML content
  };

  // 3) Actually send the email
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // You can see a preview of the sent email by visiting the URL in the console
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
