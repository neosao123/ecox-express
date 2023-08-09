const mongoose = require('mongoose');
require("dotenv");
const { MONGO_URL } = require('../config/config');


module.exports = {
    connectDB: () => {
        mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.log('Failed to connect to MongoDB', err));
    }
}