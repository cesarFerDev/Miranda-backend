import mongoose, { Schema, InferSchemaType } from "mongoose";
import { Contact } from "../interfaces/interfaces";

const contactSchema = new Schema({
    contact_date: {
        type: String,
        required: true
    },
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
    content_title: {
        type: String,
        required: true
    },
    content_text: {
        type: String,
        required: true
    },
    is_archived: {
        type: Boolean,
        required: true
    }
}, {versionKey: false});

export interface MongoContact extends InferSchemaType<typeof contactSchema>{};

export const ContactModel = mongoose.model('Contact', contactSchema);