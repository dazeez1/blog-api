const mongoose = require('mongoose');

let memoryServer; // lazy initialized

const connectWithMemoryServer = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  const conn = await mongoose.connect(uri, {
    dbName: 'blogdb_test',
  });
  console.log(`🧪 Using in-memory MongoDB at ${uri}`);
  return conn;
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (
      !mongoUri ||
      process.env.USE_IN_MEMORY_DB === 'true' ||
      process.env.NODE_ENV === 'test'
    ) {
      return await connectWithMemoryServer();
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Mongo connection failed: ${error.message}`);

    // Fallback to in-memory in dev
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('Falling back to in-memory MongoDB...');
        return await connectWithMemoryServer();
      } catch (memErr) {
        console.error(`Failed to start in-memory MongoDB: ${memErr.message}`);
      }
    }

    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
