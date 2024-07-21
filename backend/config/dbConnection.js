const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
 
  const MONGODB_URL = process.env.MONGO_URI;
  try {
     const conn =  await mongoose.connect(MONGODB_URL);
      console.log("MongoDB Connected Successfully and Host:" , conn.connection.host);

      console.log()

      // Listen for subsequent connection errors
      mongoose.connection.on('error', (err) => {
          console.error("MongoDB Connection Error:", err);
      });
  } catch (err) {
      console.error("MongoDB Connection Error:", err);
      process.exit(1); // Exit process with failure
  }


};

module.exports = connectDB;
