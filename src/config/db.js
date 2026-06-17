const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

/**
 * Establish connection to local In-Memory MongoDB database exclusively
 */
const connectDB = async () => {
  try {
    console.log('Starting local In-Memory MongoDB Server...');
    
    // Instantiate MongoMemoryServer
    mongod = await MongoMemoryServer.create();
    const inMemoryUri = mongod.getUri();
    
    console.log(`Local In-Memory MongoDB Server running at: ${inMemoryUri}`);
    console.log('Connecting Mongoose to In-Memory MongoDB...');
    
    const conn = await mongoose.connect(inMemoryUri);
    
    console.log('==================================================');
    console.log(`🎉 In-Memory MongoDB Connected: ${conn.connection.host}`);
    console.log('==================================================');
  } catch (error) {
    console.error(`❌ In-Memory MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Helper to clean up database connections (used in tests or shutdown hooks)
 */
connectDB.disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      console.log('In-Memory MongoDB stopped.');
    }
  } catch (error) {
    console.error('Error during database disconnection:', error.message);
  }
};

module.exports = connectDB;
