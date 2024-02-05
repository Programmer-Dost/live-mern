const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn.connect) {
      console.log("Connected to MongoDB");
    } else {
      console.log(conn, "Can't connect to MongoDB");
    }
  } catch (e) {
    console.log(e);
  }
}
module.exports = connectDB;
