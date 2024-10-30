const express = require('express');
const bodyParser = require('body-parser');
const util = require('./util');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
    try {
        console.log("GET / - Root endpoint accessed.");
        res.send("Hello");
    } catch (error) {
        console.error("Error in GET /:", error);
        res.status(500).send("Server error at root endpoint.");
    }
});

app.get('/get_location_names', (req, res) => {
    try {
        console.log("GET /get_location_names - Fetching location names.");
        const locations = util.getLocationNames();
        res.json({ locations });
    } catch (error) {
        console.error("Error in GET /get_location_names:", error);
        res.status(500).json({ error: 'Failed to fetch location names.' });
    }
});

app.post('/predict_home_price', (req, res) => {
    try {
        console.log("POST /predict_home_price - Predicting home price with data:", req.body);
        const { total_sqft, location, bhk, bath } = req.body;

        if (!total_sqft || !location || !bhk || !bath) {
            console.warn("Missing fields in request. Returning default value 100.");
            return res.json({estimated_price: 100});
        }

        const estimatedPrice = util.getEstimatedPrice(location, parseFloat(total_sqft), parseInt(bhk), parseInt(bath));
        console.log("Predicted price:", estimatedPrice);
        res.json({ estimated_price: estimatedPrice });
    } catch (error) {
        console.error("Error in POST /predict_home_price:", error);
        res.status(500).json({ error: 'Failed to predict home price.' });
    }
});

const startServer = async () => {
    try {
        console.log("Starting Node.js Express Server For Home Price Prediction...");
        await util.loadSavedArtifacts();
        console.log("Artifacts loaded successfully.");
        
        app.listen(PORT, '127.0.0.1', () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

startServer();
