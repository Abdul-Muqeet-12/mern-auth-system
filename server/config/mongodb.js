import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth-system`);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
