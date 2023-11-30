const nodemailer = require('nodemailer');

// Configure nodemailer with your Outlook email account settings
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'Outreach@iptse.com',
      pass: 'Zub92097',
    },
  });

 const sendMail = (req,res) =>{

    // const { to, subject, text } = req.body;

    const mailOptions = {
      from: 'Outreach@iptse.com',
      to: 'ashutoshsharma86416@gmail.com',
      subject: 'test',
      text: 'this is test msg',
    };

    
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully' });
    }
  });
  }
  module.exports = sendMail;
