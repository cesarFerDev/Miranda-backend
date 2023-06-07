import bookingsJSON from "../../data/bookings.json";
import { Booking } from "../../interfaces/interfaces";

import fs from "fs";

// const connectPromise = async() => {
//     const connection = await mysql2.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'root_miranda',
//         database: 'mirandahoteldb',
//     });
// }

export const bookingsData = bookingsJSON as Booking[];

//var db = require('mysql2-promise')();



const updateJSONFile = (bookingsList: Booking[]) => {
    fs.writeFileSync("./data/bookings.json", JSON.stringify(bookingsList, null, 2));
}

export const get = async() => {
    return bookingsData;
};

export const getSingleBooking = async(id: string) => {
    const bookingObject = bookingsData.find(booking => booking.id === id) || null;
    return bookingObject;
};

export const post = async(bookingObject: Booking) => {
    bookingObject.id = (Math.floor((Math.random() * 100000))).toString();
    bookingsData.push(bookingObject);
    updateJSONFile(bookingsData);
    return bookingObject;
};

export const put = async(id: string, updateInfo: Partial<Booking>) => {

    for (let i = 0; i < bookingsData.length; i++) {
        if (bookingsData[i].id === id) {
            bookingsData[i] = {...bookingsData[i], ...updateInfo};
            updateJSONFile(bookingsData);
            return bookingsData[i];
        }
    }
};

export const delBooking = async(id: string) => {
    const bookingToRemoveIndex = bookingsData.findIndex(booking => booking.id === id);

    if (bookingToRemoveIndex < 0) {
        throw new Error("Booking not found");
    }   

    bookingsData.splice(bookingToRemoveIndex, 1);
    updateJSONFile(bookingsData);
}