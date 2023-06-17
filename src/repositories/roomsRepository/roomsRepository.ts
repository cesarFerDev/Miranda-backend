import roomsJSON from "../../data/rooms.json";
import { Room } from "../../interfaces/interfaces";
import { validateRoom } from "../../controllers/roomsController";
import fs from "fs";

export const roomsData = roomsJSON as Room[];

const updateJSONFile = (roomsList: Room[]) => {
    fs.writeFileSync("./data/rooms.json", JSON.stringify(roomsList, null, 2));
}

export const get = async() => {
    return roomsData;
};

export const getSingleRoom = async(id: string) => {
    const room = roomsData.find(room => room.room_id === id) || null;
    return room;
};

export const post = async(roomObject: Room) => {
    roomObject.room_id = (Math.floor((Math.random() * 100000))).toString();
    roomsData.push(roomObject);
    updateJSONFile(roomsData);
    return roomObject;
};

export const put = async(id: string, updateInfo: Partial<Room>) => {
    if (updateInfo.room_id && updateInfo.room_id !== id) {
        throw new Error("Room ID can't be changed");
    }

    for (let i = 0; i < roomsData.length; i++) {
        if (roomsData[i].room_id === id) {
            Object.assign(roomsData[i], updateInfo);
            if (validateRoom(roomsData[i])) {
                updateJSONFile(roomsData);
                return roomsData[i];
            } else {
                throw new Error("Invalid data input");
            }
        }
    }
    return null;
};

export const delRoom = async(id: string) => {
    const roomToRemoveIndex = roomsData.findIndex(room => room.room_id === id);

    if (roomToRemoveIndex < 0) {
        throw new Error("Room not found");
    }   

    roomsData.splice(roomToRemoveIndex, 1);
    updateJSONFile(roomsData);
}