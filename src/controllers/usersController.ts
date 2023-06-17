import {Request, Response} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { User } from '../interfaces/interfaces';
//import {get, getSingleUser, post, put, delUser} from "../repositories/users-repository";
//import {get, getSingleUser, post, put, delUser} from "../repositories/usersRepository/usersRepository-sql";
import {get, getSingleUser, post, put, delUser} from "../repositories/usersRepository/usersRepository-mongo";
import Joi from 'joi';

const userSchema = Joi.object({
    photo: Joi.string()
        .max(255)
        .required(),
    user_name: Joi.string()
        .max(100)
        .required(),
    job: Joi.string()
        .valid('Manager', 'Receptionist', 'Room Service')
        .required(),
    email: Joi.string()
        .email()
        .max(50)
        .required(),
    contact: Joi.string()
        .max(30)
        .required(),
    start_date: Joi.string()
        .isoDate()
        .required(),
    job_description: Joi.string()
        .max(255)
        .required(),
    is_active: Joi.boolean()
        .required(),
    password: Joi.string()
        .max(255)
        .required()
});

//Get All Users
exports.getAllUsers = expressAsyncHandler(async(req: Request, res: Response) => {
    try {
        const usersList = await get();
        res.send(usersList);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Get a single User
exports.getSingleUser = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    try {
        const id = req.params.id;
        const user = await getSingleUser(id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//Create a single User
exports.postUser = expressAsyncHandler(async(req: Request<{}, User, User>, res: Response) => {
    
    try {
        const newUser = req.body;
        if (userSchema.validate(newUser)) {
            
            const userToReturn = await post(newUser);
            res.send(userToReturn); 
        } else {
            res.status(400).send("Invalid data input");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//Edit a single User
exports.putUser = expressAsyncHandler(async(req: Request<{id: string}, User, Partial<User>>, res: Response) => {
    
    try {
        const id = req.params.id;
        const updatedInfo = req.body;
        const updatedUser = await put(id, updatedInfo);
        if (updatedUser) {
            res.send(updatedUser);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//Delete a single User
exports.deleteUser = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    
    try {
        const id = req.params.id;
        const userDeleted = await delUser(id);
        if (userDeleted) {
            res.send(id);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});