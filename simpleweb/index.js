const express = require('express');
const app = express();

// Single route that responds with 'Hi There!'
app.get('/', (req, res) => {
    res.send('Hi There!');
});

// Application listens on port 8080
app.listen(8080, () => {
    console.log('Server is running on port 8095');
});
