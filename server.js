const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

const API_KEY = 'AIzaSyAIvOQ5TMxm9IdWuZeipj4OyASsOyiKLTo'; 

app.use(cors()); 

app.get('/api/places', async (req, res) => {
  const { lat, lng, type } = req.query;
  
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        type,
        key: API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Google API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
