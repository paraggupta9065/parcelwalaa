const mongoose = require('mongoose');

const connectToDb = async () => {
    const url = process.env.DB_URL;
    await mongoose.connect(url, () => {
        console.log('database connected');
    });
}

module.exports = connectToDb;