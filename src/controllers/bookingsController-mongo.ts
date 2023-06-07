import {Request, Response} from 'express';
import expressAsyncHandler from 'express-async-handler';
import {get, getSingleBooking, post, put, delBooking} from "../repositories/bookingsRepository/bookingsRepository-mongo";
import Joi from "joi";
import 'dotenv/config';
import { MongoBooking } from '@src/mongoSchemas/bookingSchema';

const validateBookingDates = (order: string, check_in: string, check_out: string) => {
    const limitDate = new Date().getTime();
    if ((Date.parse(check_in) > limitDate && Date.parse(check_in) >= Date.parse(order)) && 
        (Date.parse(check_out) > limitDate && Date.parse(check_out) > Date.parse(check_in))) {
        return true;
    }
    return false;
};

const bookingSchema = Joi.object({
    guest_name: Joi.string()
        .max(100)
        .required(),
    guest_email: Joi.string()
        .email()
        .max(50)
        .required(),
    guest_contact: Joi.string()
        .max(30)
        .required(),
    order_date: Joi.string()
        .isoDate()
        .required(),
    check_in: Joi.string()
        .isoDate()
        .required(),
    check_out: Joi.string()
        .isoDate()
        .required(),
    special_request: Joi.string()
        .max(255),
    room_id: Joi.string()
        .max(8)
        .required(),
    status: Joi.string()
        .valid('Check In', 'Check Out', 'In progress')
        .required()
});

//Get All Bookings
exports.getAllBookings = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
        const bookingsList = await get();
        res.send(bookingsList);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Get a single Booking
exports.getBooking = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    try {
        const id = req.params.id;
        const booking = await getSingleBooking(id);
        if (booking) {
            res.send(booking);
        } else {
            res.status(404).send("Booking not found");
        }
        

    } catch (error) {
        res.status(500).send(error);
    }
    
});

//Create a single Booking
exports.postBooking = expressAsyncHandler(async(req: Request<{}, MongoBooking, MongoBooking>, res: Response) => {
    
    try {
        const newBooking = req.body;
        if (bookingSchema.validate(newBooking) && 
            validateBookingDates(newBooking.order_date, newBooking.check_in, newBooking.check_out)) {
            await post(newBooking);
            console.log(newBooking)
            res.send(newBooking);
        } else {
            res.status(400).send("Invalid data input");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//Edit a single Booking
exports.putBooking = expressAsyncHandler(async(req: Request<{id: string}, MongoBooking, MongoBooking>, res: Response) => {
    
    try {
        const id = req.params.id;
        const updatedInfo = req.body;
        const updatedBooking = await put(id, updatedInfo);
        if (updatedBooking) {
            res.send(updatedBooking);
        } else {
            res.status(404).send("Booking not found");
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
});

//Delete a single Booking
exports.deleteBooking = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    try {
        const id = req.params.id;
        const bookingDeleted = await delBooking(id);
        if (bookingDeleted) {
            res.send(id);
        } else {
            res.status(404).send("Booking not found");
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
});