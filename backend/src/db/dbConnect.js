import mongoose from "mongoose";
import dns from "dns";

const dbConnect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }

    if (uri.startsWith("mongodb+srv://")) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      console.log("Using public DNS servers for MongoDB SRV resolution");
    }

    const connect = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
    });

    console.log(`MongoDb connected ${connect.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDb", error);
    process.exit(1);
  }
};

export default dbConnect;