import { RowDataPacket } from "mysql2";
import { Booking } from "../../interfaces/interfaces";
import { connection } from "../../sql/mysqlConnector";
import { v4 } from 'uuid';

export const get = async() => {
    try {
        const con = await connection();
        const [rowsData] = await con.execute('SELECT * FROM Bookings');
        return rowsData as Booking[];
    } catch (error) {
        throw new Error(error);
    }
};

export const getSingleBooking = async(id: string) => {
    try {
        const con = await connection();
        const [rowData] = await con.execute<RowDataPacket[]>('SELECT * FROM Bookings WHERE `id` = ?', [id]);
        return rowData[0] as Booking;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(bookingObject: Booking) => {
    try {
        const con = await connection();
        bookingObject.id = v4().substring(0, 8);
        const [rowData] = await con.execute<RowDataPacket[]>('INSERT INTO Bookings (id, guest_name, guest_email, guest_contact, order_date, check_in, check_out, special_request, room_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [bookingObject.id, bookingObject.guest_name, bookingObject.guest_email, bookingObject.guest_contact, bookingObject.order_date, bookingObject.check_in, bookingObject.check_out, bookingObject.special_request, bookingObject.room_id, bookingObject.status]);
        return rowData;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<Booking>) => {
    try {
        const con = await connection();
        const bookingToUpdate = await getSingleBooking(id);
        
        const [rowData] = await con.execute<RowDataPacket[]>('UPDATE Bookings SET `guest_name`=?, `guest_email`=?, `guest_contact`=?, `order_date`=?, `check_in`=?, `check_out`=?, `special_request`=?, `room_id`=?, `status`=? WHERE `id` = ?',
        [updateInfo.guest_name ? updateInfo.guest_name : bookingToUpdate.guest_name,
        updateInfo.guest_email ? updateInfo.guest_email : bookingToUpdate.guest_email,
        updateInfo.guest_contact ? updateInfo.guest_contact : bookingToUpdate.guest_contact,
        updateInfo.order_date ? updateInfo.order_date : bookingToUpdate.order_date,
        updateInfo.check_in ? updateInfo.check_in : bookingToUpdate.check_in,
        updateInfo.check_out ? updateInfo.check_out : bookingToUpdate.check_out,
        updateInfo.special_request ? updateInfo.special_request : bookingToUpdate.special_request,
        updateInfo.room_id ? updateInfo.room_id : bookingToUpdate.room_id,
        updateInfo.status ? updateInfo.status : bookingToUpdate.status,
        id]);
        const bookingUpdated = await getSingleBooking(id);
        return bookingUpdated;
    } catch (error) {
        throw new Error(error);
    }
};

export const delBooking = async(id: string) => {
    try {
        const con = await connection();
        con.execute('DELETE FROM Bookings WHERE `id` = ?', [id]);
    } catch (error) {
        throw new Error(error);
    }
};