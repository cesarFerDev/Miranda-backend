import mongoose from "mongoose";
import 'dotenv/config';


export const connection = async() => {
    await mongoose.connect(String(process.env.MONGO_DB_URI));
};

export const disconnection = async() => {
    await mongoose.disconnect();
};