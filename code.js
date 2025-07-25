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
    const qs = require('querystring');
    const tokenRes = await axios.post(
      'https://www.figma.com/api/oauth/token',
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // You can now store tokenRes.data.access_token in a session or database
    // For demo, just show a success message
    res.send(`<script>
      window.opener.postMessage({ type: 'figma-token', token: '${tokenRes.data.access_token}' }, '*');
      window.close();
    </script>`);
  } catch (err) {
    // Improved error logging
    console.error(err.response ? err.response.data : err);
    res.status(500).send('OAuth error: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OAuth backend running on port ${PORT}`));
