import { UserModel, MongoUser } from "../../mongoSchemas/userSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const get = async() => {
    try {
        await connection();
        const rooms: MongoUser[] = await UserModel.find().exec();
        await disconnection();
        return rooms;
    } catch (error) {
        throw new Error(error);
    }
};

export const getSingleUser = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const user: MongoUser | null = await UserModel.findOne()
            .where('_id')
            .equals(idParse)
            .exec();
        await disconnection();
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(userObject: MongoUser) => {
    try {
        await connection();
        userObject.password = await bcrypt.hash(userObject.password!, 10);
        const newUser = new UserModel(userObject);
        return await newUser.save();
        // const response = await UserModel.collection.insertOne(userObject);
        // const newUser = await UserModel.findOne()
        // .where('_id')
        // .equals(response.insertedId)
        // .exec();
        // await disconnection();
        // return newUser as MongoUser;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<MongoUser>) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        if (updateInfo.password) {
            updateInfo.password = await bcrypt.hash(updateInfo.password!, 10);
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: idParse}, {$set: updateInfo}, {new: true});
        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
};

export const delUser = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const userDeleted = await UserModel.findOneAndDelete({_id: idParse});
        await disconnection();
        return userDeleted ? userDeleted._id.toString() : "";
    } catch (error) {
        throw new Error(error);
    }
};