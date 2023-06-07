import { ContactModel, MongoContact } from "../../mongoSchemas/contactSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import mongoose from "mongoose";

export const get = async() => {
    try {
        await connection();
        const contacts: MongoContact[] = await ContactModel.find().exec();
        await disconnection();
        return contacts;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(contactObject: MongoContact) => {
    try {
        await connection();
        const newContact = new ContactModel(contactObject);
        await disconnection();
        return await newContact.save();
        // const response = await ContactModel.collection.insertOne(contactObject);
        // const newContact = await ContactModel.findOne()
        //     .where('_id')
        //     .equals(response.insertedId)
        //     .exec();
        // await disconnection();
        // return newContact as MongoContact;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const updatedContact = await ContactModel.findOneAndUpdate({_id: idParse}, {$set: {is_archived: true}}, {new: true});
        await disconnection();
        return updatedContact;
    } catch (error) {
        throw new Error(error);
    }
};

export const delContact = async(id: string) => {
    try {
        await connection();
        const idParse = new mongoose.Types.ObjectId(id);
        const contactDeleted = await ContactModel.findOneAndDelete({_id: idParse});
        await disconnection();
        return contactDeleted;
    } catch (error) {
        throw new Error(error);
    }
};