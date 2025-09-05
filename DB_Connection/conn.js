const mongoose = require('mongoose');

const dataBaseConnection = async () => {
    try {
        const DB_connection = mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("database connected successfully")
    } catch (error) {
        console.log("error in database connection : ", error);
    }
};


module.exports = dataBaseConnection;