
const express = require('express');
const bodyParser = require('body-parser');
const util = require('./util');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello");
});

app.get('/get_location_names', (req, res) => {
    try {
        const locations = util.getLocationNames();
        res.json({ locations });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location names.' });
    }
});

app.post('/predict_home_price', (req, res) => {
    const { total_sqft, location, bhk, bath } = req.body;

    if (!total_sqft || !location || !bhk || !bath) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const estimatedPrice = util.getEstimatedPrice(location, parseFloat(total_sqft), parseInt(bhk), parseInt(bath));
        res.json({ estimated_price: estimatedPrice });
    } catch (error) {
        res.status(500).json({ error: 'Failed to predict home price.' });
    }
});

const startServer = async () => {
    console.log("Starting Node.js Express Server For Home Price Prediction...");
    await util.loadSavedArtifacts();
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
};

startServer();
