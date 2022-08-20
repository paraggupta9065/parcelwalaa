const mongoose = require('mongoose');

const connectToDb = async () => {
    const url = process.env.DB_URL;
    try {
        await mongoose.connect(url);
        console.log("done");

    } catch (error) {
        console.log("error connection to db")
        console.log(error)
    }
}

module.exports = connectToDb;