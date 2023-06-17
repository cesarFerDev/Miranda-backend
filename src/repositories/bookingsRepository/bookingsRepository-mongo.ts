import { BookingModel, MongoBooking } from "../../mongoSchemas/bookingSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import { Booking, Contact, Room, RoomSimple, User } from "@src/interfaces/interfaces";
import { getSingleRoom } from "../roomsRepository/roomsRepository-mongo";
import { MongoRoom } from "@src/mongoSchemas/roomSchema";

export const idConverter = (mongoObject: any): Booking | User | Contact | Room => {
    const objClone = (({ _id, ...o }) => o)(mongoObject._doc);
    objClone.id = mongoObject._id.toString();
    return objClone;
}

export const bookingRoomRefactor = (booking: any, room: Room) => {
    const bookingClone = (({ room_id, ...o }) => o)(booking);
    bookingClone.room = room;
    return bookingClone as Booking;
}

export const bookingRefactor = async(booking: any) => {
    const roomBooked = await getSingleRoom(booking.room_id);
    if (roomBooked) {
        let aux = idConverter(booking);
        return bookingRoomRefactor(aux, roomBooked) as Booking;
    }
    return null;
}

export const get = async() => {
    try {
        // await connection();
        const bookings = await BookingModel.find().exec();
        //const bookingsToReturn = bookings.map(booking => bookingRefactor(booking));
        const bookingsToReturn = [];
        for (let i = 0; i < bookings.length; i++) {
            bookingsToReturn.push(await bookingRefactor(bookings[i]));
        }
        return bookingsToReturn as Booking[];
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const getSingleBooking = async(id: string) => {
    try {
        //await connection();
        const booking = await BookingModel.findOne()
            .where('_id')
            .equals(id)
            .exec();
        let bookingToReturn = null;
        if (booking) {
            // const roomBooked = await getSingleRoom(booking?.room_id);
            // bookingToReturn = idConverter(booking);
            // bookingToReturn = bookingRoomRefactor(bookingToReturn, roomBooked!);
            // console.log(bookingToReturn)
            bookingToReturn = await bookingRefactor(booking);
        };
        return bookingToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const post = async(bookingObject: MongoBooking) => {
    try {
        const roomBooked = await getSingleRoom(bookingObject.room_id);
        if (roomBooked) {
            //await connection();
            const newBooking= new BookingModel(bookingObject);
            await newBooking.save();
            let bookingToReturn = idConverter(newBooking);
            bookingToReturn = bookingRoomRefactor(bookingToReturn, roomBooked); //Ya tengo la room antes no hace falta buscar otra vez
            //let bookingToReturn = bookingRefactor(newBooking)
            return bookingToReturn;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(error);
    } 
    // finally {
    //     await disconnection();
    // }
};

export const put = async(id: string, updateInfo: Partial<MongoBooking>) => {
    try {
        //await connection();
        const updatedBooking = await BookingModel.findOneAndUpdate({_id: id}, {$set: updateInfo}, {new: true});
        let bookingToReturn = null;
        if (updatedBooking) {
            const roomBooked = await getSingleRoom(updatedBooking?.room_id);
            if (roomBooked) {
                bookingToReturn = idConverter(updatedBooking);
                bookingToReturn = bookingRoomRefactor(bookingToReturn, roomBooked);
            }
        };
        return bookingToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const delBooking = async(id: string) => {
    try {
        //await connection();
        const bookingDeleted = await BookingModel.findOneAndDelete({_id: id});
        let bookingToReturn: Booking | null = null;
        if (bookingDeleted) {
            // bookingToReturn = idConverter(bookingDeleted) as Booking;
            bookingToReturn = await bookingRefactor(bookingDeleted);
        };
        return bookingToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

