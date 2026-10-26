// import dns from 'node:dns/promises'
// dns.setServers(['1.1.1.1','8.8.8.8'])
import mongoose from "mongoose"

async function connectDB() {
  await mongoose.connect('mongodb+srv://pakistanhafsa_db_user:3BogOY0HJEoADbZV@cluster0.x1nj6a2.mongodb.net/users');
  console.log("Connected to DB");
  console.log("MongoDB state:", mongoose.connection.readyState);
}
export default connectDB