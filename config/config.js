const mongoose = require("mongoose");
require("colors");

//connecDB Function
// `mongodb+srv://shashank:HK2RJ2gQyl7MqBYN@cluster0.ouqeamn.mongodb.net/Netflix?retryWrites=true&w=majority`

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://shashank:HK2RJ2gQyl7MqBYN@cluster0.ouqeamn.mongodb.net/Netflix?retryWrites=true&w=majority`);
    console.log(`MongoDB Connected ${conn.connection.host}`.bgYellow);
  } catch (error) {
    console.log(`Error : ${error.message}`.bgRed);
    process.exit(1);
  }
};

//export
module.exports = connectDb;
