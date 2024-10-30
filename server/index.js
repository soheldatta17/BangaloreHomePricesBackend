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
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bangalore Home Price Estimator API</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f7f8fa;
                        color: #333;
                    }
                    .container {
                        text-align: center;
                        max-width: 600px;
                        padding: 20px;
                        background: #fff;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        border-radius: 8px;
                    }
                    h1 {
                        color: #4CAF50;
                        margin-bottom: 10px;
                    }
                    h2 {
                        color: #333;
                        margin: 10px 0;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.6;
                        margin-top: 0;
                    }
                    code {
                        display: inline-block;
                        background: #f2f2f2;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 15px;
                    }
                    .api-info {
                        text-align: left;
                        margin-top: 20px;
                    }
                    .api-info h3 {
                        color: #4CAF50;
                        margin-bottom: 8px;
                    }
                    .api-info pre {
                        background-color: #f4f4f4;
                        padding: 15px;
                        border-radius: 5px;
                        overflow-x: auto;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to the Bangalore Home Price Estimator API by SOHEL DATTA</h1>
                    <p>This API provides an estimated price for homes in Bangalore based on various factors like area (sqft), BHK, and bathroom count.</p>
                    <div class="api-info">
                        <h3>Available Endpoints</h3>
                        <h2>1. <code>POST /predict_home_price</code></h2>
                        <p><strong>Description:</strong> Estimates the home price based on input parameters.</p>
                        <pre>
Request:
POST /predict_home_price
Content-Type: application/json
{
    "total_sqft": 1200,
    "bhk": 2,
    "bath": 2,
    "location": "Electronic City"
}

Response:
{
    "estimated_price": "85 Lakh"
}
                        </pre>

                        <h2>2. <code>GET /get_location_names</code></h2>
                        <p><strong>Description:</strong> Retrieves the list of available locations for predictions.</p>
                        <pre>
Response:
{
    "locations": ["Electronic City", "Rajaji Nagar", "Whitefield", ...]
}
                        </pre>
                    </div>
                </div>
            </body>
            </html>
        `);
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
