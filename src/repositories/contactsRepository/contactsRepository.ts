import contactsJSON from "../../data/contacts.json";
import { Contact } from "../../interfaces/interfaces";
import fs from "fs";

export const contactsData = contactsJSON as Contact[];

const updateJSONFile = (contactsList: Contact[]) => {
    fs.writeFileSync("./data/contacts.json", JSON.stringify(contactsList, null, 2));
}

export const get = async() => {
    return contactsData;
};

export const post = async(contactObject: Contact) => {
    contactObject.contact_id = (Math.floor((Math.random() * 100000))).toString();
    contactsData.push(contactObject);
    updateJSONFile(contactsData);
    return contactObject;
};

export const delContact = async(id: string) => {
    const contactToRemoveIndex = contactsData.findIndex(contact => contact.contact_id === id);

    if (contactToRemoveIndex < 0) {
        throw new Error("Contact not found");
    }   

    contactsData.splice(contactToRemoveIndex, 1);
    updateJSONFile(contactsData);
}