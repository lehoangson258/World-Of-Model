const mongoose = require('mongoose');
const config = require('config');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.get('app.mongo_url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectDB;