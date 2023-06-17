import { ContactModel, MongoContact } from "../../mongoSchemas/contactSchema";
import { connection, disconnection } from "../../mongo/mongoConnector";
import { idConverter } from "../bookingsRepository/bookingsRepository-mongo";
import { Contact } from "@src/interfaces/interfaces";

export const get = async() => {
    try {
        //await connection();
        const contacts = await ContactModel.find().exec();
        const contactsToReturn = contacts.map(contact => idConverter(contact));
        return contactsToReturn as Contact[];
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const post = async(contactObject: MongoContact) => {
    try {
        //await connection();
        const newContact = new ContactModel(contactObject);
        await newContact.save();
        const contactToReturn = idConverter(newContact) as Contact;
        return contactToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

export const put = async(id: string) => {
    try {
        //await connection();
        const updatedContact = await ContactModel.findOneAndUpdate({_id: id}, {$set: {is_archived: true}}, {new: true});
        let contactToReturn: Contact | null = null;
        if (updatedContact) {
            contactToReturn = idConverter(updatedContact) as Contact;
        };
        return contactToReturn;
    } catch (error) {
        throw new Error(error);
    }
    //  finally {
    //     await disconnection();
    // }
};

// export const delContact = async(id: string) => {
//     try {
//         await connection();
//         const idParse = new mongoose.Types.ObjectId(id);
//         const contactDeleted = await ContactModel.findOneAndDelete({_id: idParse});
//         return contactDeleted;
//     } catch (error) {
//         throw new Error(error);
//     } finally {
//         await disconnection();
//     }
// };