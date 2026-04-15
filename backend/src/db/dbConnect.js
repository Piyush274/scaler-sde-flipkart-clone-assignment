import mongoose from "mongoose";
import dns from "dns";

const dbConnect = async () => {
  try {
    if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      console.log("Using public DNS servers for MongoDB SRV resolution");
    }

    const connect = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(`MongoDb connected ${connect.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDb", error);
    process.exit(1);
  }
};

export default dbConnect;