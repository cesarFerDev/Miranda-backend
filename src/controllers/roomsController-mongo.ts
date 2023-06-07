import {Request, Response} from 'express';
import expressAsyncHandler from 'express-async-handler';
import {get, getSingleRoom, post, put, delRoom} from "../repositories/roomsRepository/roomsRepository-mongo";
import Joi from 'joi';
import { MongoRoom } from '@src/mongoSchemas/roomSchema';

// const checkArrayType = (array: any[],type: string) => {

//     for (let i = 0; i < array.length; i++) {
//         if (typeof array[i] !== type) {
//             return false;
//         }
//     }
//     return true;
// }

const bookingSchema = Joi.object({
    type: Joi.string()
        .valid('Single Bed', 'Double Bed', 'Double Superior', 'Suite')
        .required(),
    number: Joi.number()
        .integer()
        .min(0)
        .max(500)
        .required(),
    price: Joi.number()
        .min(0)
        .max(1000000)
        .precision(2)
        .required(),
    discount: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required(),
    cancellation: Joi.string()
        .max(255),
    description: Joi.string()
        .max(255)
        .required(),
    amenities: Joi.array()
        .items(Joi.string()
        .max(50))
        .required(),
    photos: Joi.array()
        .items(Joi.string()
        .max(255))
        .required(),     
    is_available: Joi.boolean()
        .required(),
});

//Get All Rooms
exports.getAllRooms = expressAsyncHandler(async(req: Request, res: Response) => {
    try {
        const roomsList = await get();
        res.send(roomsList);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Get a single Room
exports.getSingleRoom = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    try {
        const id = req.params.id;
        const room = await getSingleRoom(id);
        if (room) {
            res.send(room);
        } else {
            res.status(404).send("Room not found");
        }

    } catch (error) {
        res.status(500).send(error);
    }
    
});

//Create a single Room
exports.postRoom = expressAsyncHandler(async(req: Request<{}, MongoRoom, MongoRoom>, res: Response) => {
    
    try {
        const newRoom = req.body;
        if (bookingSchema.validate(newRoom)) {
            await post(newRoom);
            res.send(newRoom);
        }
        res.status(400).send("Invalid data input");
    } catch (error) {
        res.status(500).send(error);
    }
});

//Edit a single Room
exports.putRoom = expressAsyncHandler(async(req: Request<{id: string}, MongoRoom, MongoRoom>, res: Response) => {
    
    try {
        const id = req.params.id;
        const updatedInfo = req.body;
        const updatedRoom = await put(id, updatedInfo);
        
        if (updatedRoom) {
            res.send(updatedRoom);
        } else {
            res.status(404).send("Room not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//Delete a single Room
exports.deleteRoom = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    
    try {
        const id = req.params.id;
        const roomDeleted = await delRoom(id);
        if (roomDeleted) {
            res.send(id);
        } else {
            res.status(404).send("Room not found");
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
});