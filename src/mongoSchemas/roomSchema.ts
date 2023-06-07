import mongoose, { Schema, InferSchemaType } from "mongoose";

const roomSchema = new Schema({
    type: {
        type: String,
        enum: ['Single Bed', 'Double Bed', 'Double Superior', 'Suite'],
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    cancellation: String,
    description: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    photos: {
        type: [String],
        required: true
    },
    is_available: {
        type: Boolean,
        required: true
    }
});

export interface MongoRoom extends InferSchemaType<typeof roomSchema>{};

export const RoomModel = mongoose.model('Room', roomSchema);