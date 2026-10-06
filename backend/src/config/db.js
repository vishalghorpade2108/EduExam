import mongoose from "mongoose";
import dns from "dns";

// Fix querySrv ECONNREFUSED caused by local DNS / ISP refusing SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

