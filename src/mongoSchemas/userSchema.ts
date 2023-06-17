import mongoose, {Schema, InferSchemaType} from "mongoose";

const userSchema = new Schema({
    photo: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    job: {
        type: String,
        enum: ['Manager', 'Receptionist', 'Room Service'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    job_description: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {versionKey: false});

export interface MongoUser extends InferSchemaType<typeof userSchema>{};

export const UserModel = mongoose.model('User', userSchema);