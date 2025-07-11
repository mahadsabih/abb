const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = 'xNcAoucWjyWIoWvjaBKTrx';
const CLIENT_SECRET = 'YXTinw46G9AcjMZ0WiH1p3d8vVu84X';
const REDIRECT_URI = 'https://abb-g4ew.onrender.com/api/figma/callback';

app.get('/api/figma/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send('No code provided');

  try {
    // Exchange code for access token
    const tokenRes = await axios.post('https://www.figma.com/api/oauth/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
        grant_type: 'authorization_code'
      }
    });

    // You can now store tokenRes.data.access_token in a session or database
    // For demo, just show a success message
   
    res.send(`<script>
      window.opener.postMessage({ type: 'figma-token', token: '${tokenRes.data.access_token}' }, '*');
      window.close();
    </script>`);
  } catch (err) {
    res.status(500).send('OAuth error: ' + err.message);
  }
});

app.listen(3000, () => console.log('OAuth backend running on port 3000'));
