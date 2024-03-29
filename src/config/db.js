const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect db successfully!');
  } catch (error) {
    console.error('Connect db error!');
  }
}

module.exports = { connect };
