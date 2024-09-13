const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const gmailEmail = defineSecret('GMAIL_EMAIL');
const gmailPassword = defineSecret('GMAIL_PASSWORD');

// Specify the secrets in the function configuration
exports.sendEmail = onRequest(
  {
    secrets: [gmailEmail, gmailPassword],
    region: 'us-central1', // Specify your desired region
  },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
      }

      const { name, email, message } = req.body;

      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail.value(),
          pass: gmailPassword.value(),
        },
      });

      const mailOptions = {
        from: gmailEmail.value(),
        to: 'petrasb@gmail.com', // Replace with your email
        subject: '[Dopamine] New inquiry',
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong><br/>${message}</p>`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Internal Server Error');
      }
    });
  }
);