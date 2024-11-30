const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

// Define your API routes here
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

module.exports.handler = serverless(app);