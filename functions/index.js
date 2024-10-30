const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const gmailEmail = defineSecret('GMAIL_EMAIL');
const gmailPassword = defineSecret('GMAIL_PASSWORD');
const recapchaSecret = defineSecret('RECAPTCHA_SECRET_KEY');

// Specify the secrets in the function configuration
exports.sendEmail = onRequest(
  {
    secrets: [gmailEmail, gmailPassword, recapchaSecret],
    region: 'us-central1', // Specify your desired region
  },
  async (req, res) => {

    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['fastly-client-ip'];

    cors(req, res, async () => {

      if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
      }

      const { name, email, message, recapcha } = req.body;

      const isCaptchaValid = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recapchaSecret.value()}&response=${recapcha}`, {
        method: 'POST'
      })
      .then(res => res.json())
      .then(res => {
        return res?.success;
      })
      .catch(err => {
        return false;
      })
    
      if (!isCaptchaValid) {
        res.status(400).send('ReCaptcha token invalid.');
        return;
      }

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
               <p><strong>Message:</strong><br/>${message}</p>
               <br/>
               <br/>
               <pre>IP: ${clientIP}</pre>
               <pre>${JSON.stringify(req.headers, null, 2)}</pre>
               `,
      };

      try {
        // await transporter.sendMail(mailOptions);
        res.status(200).send(JSON.stringify({ message: 'Message sent successfully' }));
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Internal Server Error');
      }
    });
  }
);