// server/util.js
console.log("hi")
const fs = require('fs');
const path = require('path');

// Declare global variables
let locations = null;
let dataColumns = null;
let model = null;

// Mock function to simulate model prediction
const predictPrice = (input) => {
    // This should contain logic for loading a model and making predictions
    // For example, we could load a pre-trained model here using TensorFlow.js or other libraries.
    
    // Here is a mock prediction logic for demonstration purposes
    const sqft = input[0]; // sqft
    const bath = input[1]; // bath
    const bhk = input[2]; // bhk

    // Mock prediction (adjust this logic to match your actual model prediction)
    return Math.round(sqft * 100 + bath * 2000 + bhk * 3000);
};

// Function to get estimated price
const getEstimatedPrice = (location, sqft, bhk, bath) => {
    const locIndex = dataColumns.indexOf(location.toLowerCase());

    const x = new Array(dataColumns.length).fill(0);
    x[0] = sqft;
    x[1] = bath;
    x[2] = bhk;
    if (locIndex >= 0) {
        x[locIndex] = 1; // Set the location index
    }

    return predictPrice(x); // Adjust this call to use your actual model
};

// Function to load saved artifacts
const loadSavedArtifacts = () => {
    console.log("Loading saved artifacts...start");
    
    // Load the columns and locations
    const columnsPath = path.join(__dirname, 'artifacts', 'columns.json');
    const modelPath = path.join(__dirname, 'artifacts', 'banglore_home_prices_model.pickle'); // Example path
    
    // Load columns.json
    const columnsData = JSON.parse(fs.readFileSync(columnsPath, 'utf8'));
    dataColumns = columnsData.data_columns;
    locations = dataColumns.slice(3); // First 3 columns are sqft, bath, bhk

    // Load your machine learning model here if applicable
    // For example, if you're using a library to load the model, implement that logic here
    // model = loadModel(modelPath); // Adjust according to your model loading logic

    console.log("Loading saved artifacts...done");
};

// Function to get location names
const getLocationNames = () => {
    return locations;
};

// Function to get data columns
const getDataColumns = () => {
    return dataColumns;
};

// Export functions
module.exports = {
    getEstimatedPrice,
    loadSavedArtifacts,
    getLocationNames,
    getDataColumns,
};

// Main execution (for testing purposes)
if (require.main === module) {
    loadSavedArtifacts();
    console.log(getLocationNames());
    console.log(getEstimatedPrice('1st phase jp nagar', 1000, 3, 3));
    console.log(getEstimatedPrice('1st phase jp nagar', 1000, 2, 2));
    console.log(getEstimatedPrice('kalhalli', 1000, 2, 2)); // other location
    console.log(getEstimatedPrice('ejipura', 1000, 2, 2));  // other location
}
