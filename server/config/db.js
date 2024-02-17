const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config()

const url = process.env.URL_DB;
async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connect successfully!!!!");
    } catch (error) {
        console.log(error);
    }
}
module.exports = { connect };