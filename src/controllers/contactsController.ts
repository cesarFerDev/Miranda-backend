import {Request, Response} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Contact } from '../interfaces/interfaces';
import {get, post, delContact} from "../repositories/contactsRepository/contactsRepository-sql";
import Joi from 'joi';

const contactSchema = Joi.object({
    check_in: Joi.string()
        .isoDate()
        .required(),
    guest_name: Joi.string()
        .max(100)
        .required(),
    guest_email: Joi.string()
        .email()
        .max(30)
        .required(),
    guest_contact: Joi.string()
        .max(30)
        .required(),
    content_title: Joi.string()
        .max(255)
        .required(),
    content_text: Joi.string()
        .max(255)
        .required(),
});

//Get All Contacts
exports.getAllContacts = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
        const contactsList = await get();
        res.send(contactsList);
    } catch (error) {
        res.status(500).send(error);
    }
});


//Create a single Contact
exports.postContact = expressAsyncHandler(async(req: Request<{}, Contact, Partial<Contact>>, res: Response) => {
    
    try {
        const newContact = req.body;
        if (contactSchema.validate(newContact)) {
            await post(newContact);
            res.send(newContact);
        } else {
            res.status(400).send("Invalid data input");
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
});

//Delete a single Contact
exports.deleteContact = expressAsyncHandler(async(req: Request<{id: string}>, res: Response) => {
    
    try {
        const id = req.params.id;
        await delContact(id);
        res.send(id);
    } catch (error) {
        res.status(500).send(error);
    }
});