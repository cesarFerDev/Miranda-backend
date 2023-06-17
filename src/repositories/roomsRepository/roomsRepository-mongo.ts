import { RoomModel, MongoRoom } from "../../mongoSchemas/roomSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import { idConverter } from "../bookingsRepository/bookingsRepository-mongo";
import { Room } from "@src/interfaces/interfaces";

export const get = async() => {
    try {
        //await connection();
        const rooms = await RoomModel.find().exec();
        const roomsToReturn = rooms.map(room => idConverter(room));
        return roomsToReturn as Room[] ;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const getSingleRoom = async(id: string) => {
    try {
        //await connection();
        const room = await RoomModel.findOne()
            .where('_id')
            .equals(id)
            .exec();
        let roomToReturn: Room | null = null;
        if (room) {
            roomToReturn = idConverter(room) as Room;
        };
        return roomToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const post = async(roomObject: MongoRoom) => {
    try {
        //await connection();
        const newRoom = new RoomModel(roomObject);
        await newRoom.save();
        const roomToReturn = idConverter(newRoom) as Room;
        return roomToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const put = async(id: string, updateInfo: Partial<MongoRoom>) => {
    try {
        //await connection();
        const updatedRoom = await RoomModel.findOneAndUpdate({_id: id}, {$set: updateInfo}, {new: true});
        let roomToReturn: Room | null = null;
        if (updatedRoom) {
            roomToReturn = idConverter(updatedRoom) as Room;
        };
        return roomToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const delRoom = async(id: string) => {
    try {
        //await connection();
        const roomDeleted = await RoomModel.findOneAndDelete({_id: id});
        let roomToReturn: Room | null = null;
        if (roomDeleted) {
            roomToReturn = idConverter(roomDeleted) as Room;
        };
        return roomToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};