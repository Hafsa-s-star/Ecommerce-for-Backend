// import dns from 'node:dns/promises'
// dns.setServers(['1.1.1.1','8.8.8.8'])
import mongoose from "mongoose"

let connectionPromise;

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in the backend environment");
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Connected to DB");
        console.log("MongoDB state:", mongoose.connection.readyState);
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }
  return connectionPromise;
}

export default connectDB;