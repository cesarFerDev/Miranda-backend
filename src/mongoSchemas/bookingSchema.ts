import mongoose, { Schema, InferSchemaType } from "mongoose";

const bookingSchema = new Schema({
    guest_name: {
        type: String,
        required: true
    },
    guest_email: {
        type: String,
        required: true
    },
    guest_contact: {
        type: String,
        required: true
    },
    order_date: {
        type: String,
        required: true
    },
    check_in: {
        type: String,
        required: true
    },
    check_out: {
        type: String,
        required: true
    },
    special_request: {
        type: String,
        required: false
    },
    room_id: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    status: {
        type: String,
        enum: ['Check In', 'Check Out', 'In Progress'],
        required: true
    }
});

export interface MongoBooking extends InferSchemaType<typeof bookingSchema>{};

export const BookingModel = mongoose.model('Booking', bookingSchema);