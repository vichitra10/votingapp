const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoute = require('./routes/userRoute');
const candidateRoute = require('./routes/candidateRoute');
const votingRoute = require('./routes/votingRoute');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const authenticateJWT = require('./middleware/auth');

require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;


// Db connection code here

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    });

// Define the common prefix for userRoute
app.use('/api/user', userRoute);
app.use('/api/candidate', authenticateJWT, candidateRoute );
app.use('/api/vote', votingRoute);

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});
