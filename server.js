const cors = require('cors');
const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
app.use(cors({
  origin: 'https://card-visit.vercel.app/', // Permita solicitações do endereço Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permita que os cabeçalhos de autenticação sejam enviados
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
const port = process.env.PORT || 5000;
app.use('/v1', route);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const {google} = require('googleapis');
const OAUTH2 = google.auth.OAuth2;

const oauth2Client = new OAUTH2(
  '1077647540821-5a420m7tvtia7l8fpbatooig6662p807.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
)

oauth2Client.setCredentials({
  refresh_token: '1//04XHaA5gDZgSFCgYIARAAGAQSNwF-L9IrU_7oDUV1_CIO2gATdpyZxodRXlAugYIemh2AmsS1J9E9f3hkGvkFrjmvVDzDX2nufu8',
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'aprendizif.guilhermec@gmail.com',
    clientId: '1077647540821-hm69809tv5ain1k8146uj76ougt3knv2.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken:'1//04XHaA5gDZgSFCgYIARAAGAQSNwF-L9IrU_7oDUV1_CIO2gATdpyZxodRXlAugYIemh2AmsS1J9E9f3hkGvkFrjmvVDzDX2nufu8',
    accessToken:'ya29.a0AfB_byCRLFbNzHErM7LMgUguXODHWxpQ4ZZcixA7gR9ubUXy_Goc2ASFCBxNwA6mvr14RuB-bkcCL1Wqh4sfABYdofH6qEcdCkaii0eNqKS_pTGpemJfFLizOw_bz8i_mTJ4yFA5QL17MTz0GCPoikDfJj-Q45nugNC1aCgYKATQSARASFQGOcNnCkrvUQysS-YH5DA26Pt6Snw0171',
  },
});

route.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, name, html } = req.body;

    const mailData = {
      from: '"Cartão de Visitas de Guilherme 👻" <aprendizif.guilhermec@gmail.com>',
      to: to,
      subject: subject,
      html: html,
      text: text,
      name: name,
    };

    const info = await transporter.sendMail(mailData);

    res.status(200).send({ message: 'Mail sent successfully!', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'An error occurred while sending the email.' });
  }
});
