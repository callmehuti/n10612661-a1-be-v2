// Using Node.js `require()`
const mongoose = require("mongoose");
const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connect successfully");
  } catch (error) {
    console.log("Failed");
    console.log(error);
  }
};

module.exports = { connect };
