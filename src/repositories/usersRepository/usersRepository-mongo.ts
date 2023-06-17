import { UserModel, MongoUser } from "../../mongoSchemas/userSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "@src/interfaces/interfaces";
import { idConverter } from "../bookingsRepository/bookingsRepository-mongo";

export const get = async() => {
    try {
        //await connection();
        const users = await UserModel.find().exec();
        const usersToReturn = users.map(user => idConverter(user));
        return usersToReturn as User[] ;
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await disconnection();
    // }
};

export const getSingleUser = async(id: string) => {
    try {
        //await connection();
        const user = await UserModel.findOne()
            .where('_id')
            .equals(id)
            .exec();
        let userToReturn: User | null = null;
        if (user) {
            userToReturn = idConverter(user) as User;
        };
        return userToReturn;
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await disconnection();
    // }
};

export const post = async(userObject: MongoUser) => {
    try {
        //await connection();
        userObject.password = await bcrypt.hash(userObject.password!, 10);
        const newUser = new UserModel(userObject);
        await newUser.save();
        const userToReturn = idConverter(newUser) as User;
        console.log(userToReturn)
        return userToReturn;
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await disconnection();
    // }
};

export const put = async(id: string, updateInfo: Partial<MongoUser>) => {
    try {
        //await connection();
        if (updateInfo.password) {
            updateInfo.password = await bcrypt.hash(updateInfo.password!, 10);
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: id}, {$set: updateInfo}, {new: true});
        let userToReturn: User | null = null;
        if (updatedUser) {
            userToReturn = idConverter(updatedUser) as User;
        };
        return userToReturn;
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await disconnection();
    // }
};

export const delUser = async(id: string) => {
    try {
        //await connection();
        const userDeleted = await UserModel.findOneAndDelete({_id: id});
        let userToReturn: User | null = null;
        if (userDeleted) {
            userToReturn = idConverter(userDeleted) as User;
        };
        return userToReturn;
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await disconnection();
    // }
};