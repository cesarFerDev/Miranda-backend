import { BookingModel, MongoBooking } from "../../mongoSchemas/bookingSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import mongoose from "mongoose";
import { Booking } from "@src/interfaces/interfaces";

const mongoToBooking = (mongoBookingObject: MongoBooking): Booking => {
    return {
        id: mongoBookingObject.room_id.toString(),
        guest_name: mongoBookingObject.guest_name,
        guest_email: mongoBookingObject.guest_email,
        guest_contact: mongoBookingObject.guest_contact,
        order_date: mongoBookingObject.order_date,
        check_in: mongoBookingObject.check_in,
        check_out: mongoBookingObject.check_out,
        special_request: mongoBookingObject.special_request ? mongoBookingObject.special_request : "",
        room_id: mongoBookingObject.room_id.toString(),
        status: mongoBookingObject.status
    }
}

export const get = async() => {
    try {
        await connection();
        const bookings: MongoBooking[] = await BookingModel.find().exec();
        await disconnection();
        return bookings;
    } catch (error) {
        throw new Error(error);
    }
};

export const getSingleBooking = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const booking = await BookingModel.findOne()
            .where('_id')
            .equals(idParse)
            .exec();
        await disconnection();
        return booking;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(bookingObject: MongoBooking) => {
    try {
        await connection();
        const newBooking= new BookingModel(bookingObject);
        await disconnection();
        return await newBooking.save();
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<MongoBooking>) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const updatedBooking = await BookingModel.findOneAndUpdate({_id: idParse}, {$set: updateInfo}, {new: true});
        return updatedBooking;  
    } catch (error) {
        throw new Error(error);
    }
};

export const delBooking = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const bookingDeleted = await BookingModel.findOneAndDelete({_id: idParse});
        await disconnection();
        return bookingDeleted;
    } catch (error) {
        throw new Error(error);
    }
};