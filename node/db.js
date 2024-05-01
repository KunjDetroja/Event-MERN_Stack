// connect to the database
const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URI,MONGO_DATABASE } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI+MONGO_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = connectDB;
