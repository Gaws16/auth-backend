const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
    })
    .then(console.log("Connection to db established!"))
    .catch((err) => {
      console.log("Unable to connect to db");
      console.error(err);
    });
}
module.exports = dbConnect;
