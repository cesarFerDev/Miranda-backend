import { RoomModel, MongoRoom } from "../../mongoSchemas/roomSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import mongoose from "mongoose";

export const get = async() => {
    try {
        await connection();
        const rooms: MongoRoom[] = await RoomModel.find().exec();
        await disconnection();
        return rooms;
    } catch (error) {
        throw new Error(error);
    }
};

export const getSingleRoom = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const room = await RoomModel.findOne()
            .where('_id')
            .equals(idParse)
            .exec();
        await disconnection();
        return room;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(roomObject: MongoRoom) => {
    try {
        await connection();
        const newRoom = new RoomModel(roomObject);
        await disconnection();
        return await newRoom.save();
        // const response = await RoomModel.collection.insertOne(roomObject);
        // const newRoom = await RoomModel.findOne()
        //     .where('_id')
        //     .equals(response.insertedId)
        //     .exec();
        // await disconnection();
        // return newRoom as MongoRoom;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<MongoRoom>) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const updatedRoom = await RoomModel.findOneAndUpdate({_id: idParse}, {$set: updateInfo}, {new: true});
        return updatedRoom;
    } catch (error) {
        throw new Error(error);
    }
};

export const delRoom = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const roomDeleted = await RoomModel.findOneAndDelete({_id: idParse});
        await disconnection();
        return roomDeleted;
    } catch (error) {
        throw new Error(error);
    }
};