// import dns from 'node:dns/promises'
// dns.setServers(['1.1.1.1','8.8.8.8'])
import mongoose from "mongoose"

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in the backend environment");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");
  console.log("MongoDB state:", mongoose.connection.readyState);
}
export default connectDB