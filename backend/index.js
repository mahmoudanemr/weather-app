require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).send({ error: 'City is required' });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        res.send(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});

