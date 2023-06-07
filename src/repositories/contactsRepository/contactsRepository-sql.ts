import { RowDataPacket } from "mysql2";
import { Contact } from "../../interfaces/interfaces";
import { connection } from "../../sql/mysqlConnector";
import { v4 } from 'uuid';

export const get = async() => {
    try {
        const con = await connection();
        const [rowsData] = await con.execute('SELECT * FROM Contacts');
        return rowsData as Contact[];
    } catch (error) {
        throw new Error(error);
    }
    
};

export const post = async(contactObject: Partial<Contact>) => {
    try {
        const con = await connection();
        contactObject.id = v4().substring(0, 8);
        const [rowData] = await con.execute<RowDataPacket[]>('INSERT INTO Contacts (id, contact_date, guest_name, guest_email, guest_contact, content_title, content_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [contactObject.id, contactObject.contact_date, contactObject.guest_name, contactObject.guest_email, contactObject.guest_contact, contactObject.content_title, contactObject.content_text]);
        return rowData[0] as Contact;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<Contact>) => {
    try {
        const con = await connection();
        const getContact = async(id: string) => {
            const [rowData] = await con.execute<RowDataPacket[]>('SELECT * FROM Contacts WHERE `id` = ?', [id]);
            return rowData[0] as Contact;
        };
        const contactToUpdate = await getContact(id);
        const [rowData] = await con.execute<RowDataPacket[]>('UPDATE Contacts SET `is_archived`=? WHERE `id` = ?',
        [false, id]);

        return rowData[0] as Contact;
    } catch (error) {
        throw new Error(error);
    }
    
};

export const delContact = async(id: string) => {
    try {
        const con = await connection();
        con.execute('DELETE FROM Contacts WHERE `id` = ?', [id]);
    } catch (error) {
        throw new Error(error);
    }
};