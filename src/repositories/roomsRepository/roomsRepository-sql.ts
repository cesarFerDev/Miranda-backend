import { RowDataPacket } from "mysql2";
import { Room } from "../../interfaces/interfaces";
import { connection } from "../../sql/mysqlConnector";
import { v4 } from 'uuid';

export const get = async() => {
    try {
        const con = await connection();
        const [rowsData] = await con.execute('SELECT * FROM Rooms');
        return rowsData as Room[];
    } catch (error) {
        throw new Error(error);
    }
};

export const getSingleRoom = async(id: string) => {
    try {
        const con = await connection();
        const [rowData] = await con.execute<RowDataPacket[]>('SELECT * FROM Rooms WHERE `id` = ?', [id]);
        return rowData[0] as Room;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(roomObject: Room) => {
    try {
        const con = await connection();
        roomObject.id = v4().substring(0, 8);
        const [rowData] = await con.execute<RowDataPacket[]>('INSERT INTO Rooms (id, type, number, price, discount, cancellation, description, amenities, photos, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [roomObject.id, roomObject.type, roomObject.number, roomObject.price, roomObject.discount, roomObject.cancellation, roomObject.description, JSON.stringify(roomObject.amenities), JSON.stringify(roomObject.photos), roomObject.is_available]);
        return rowData;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<Room>) => {
    try {
        const con = await connection();
        const roomToUpdate = await getSingleRoom(id);
        const [rowData] = await con.execute<RowDataPacket[]>('UPDATE Rooms SET `type`=?, `number`=?, `price`=?, `discount`=?, `cancellation`=?, `description`=?, `amenities`=?, `photos`=?, `is_available`=? WHERE `id` = ?',
        [updateInfo.type ? updateInfo.type : roomToUpdate.type,
        updateInfo.number ? updateInfo.number : roomToUpdate.number,
        updateInfo.price ? updateInfo.price : roomToUpdate.price,
        updateInfo.discount ? updateInfo.discount : roomToUpdate.discount,
        updateInfo.cancellation ? updateInfo.cancellation : roomToUpdate.cancellation,
        updateInfo.description ? updateInfo.description : roomToUpdate.description,
        updateInfo.amenities ? updateInfo.amenities : JSON.stringify(roomToUpdate.amenities),
        updateInfo.photos ? updateInfo.photos : JSON.stringify(roomToUpdate.photos),
        updateInfo.is_available ? updateInfo.is_available : roomToUpdate.is_available,
        id]);
        const roomUpdated = await getSingleRoom(id);
        return roomUpdated;
    } catch (error) {
        throw new Error(error);
    }
};

export const delRoom = async(id: string) => {
    try {
        const con = await connection();
        con.execute('DELETE FROM Rooms WHERE `id` = ?', [id]);
    } catch (error) {
        throw new Error(error);
    }
};