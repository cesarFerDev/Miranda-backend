import { RowDataPacket } from "mysql2";
import { User } from "../../interfaces/interfaces";
import { connection } from "../../sql/mysqlConnector";
import { v4 } from 'uuid';
import bcrypt from "bcrypt";

export const get = async() => {
    try {
        const con = await connection();
        const [rowsData] = await con.execute<RowDataPacket[]>('SELECT * FROM Users');
        return rowsData as User[];
    } catch (error) {
        throw new Error(error);
    }
};

export const getSingleUser = async(id: string) => {
    try {
        const con = await connection();
        const [rowData] = await con.execute<RowDataPacket[]>('SELECT * FROM Users WHERE `id` = ?', [id]);
        return rowData[0] as User;
    } catch (error) {
        throw new Error(error);
    }
};

export const post = async(userObject: User) => {
    try {
        const con = await connection();
        userObject.id = v4().substring(0, 8);
        userObject.password = await bcrypt.hash(userObject.password!, 10);
        const [rowData] = await con.execute<RowDataPacket[]>('INSERT INTO Users (id, photo, user_name, job, email, contact, start_date, job_description, is_active, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userObject.id, userObject.photo, userObject.user_name, userObject.job, userObject.email, userObject.contact, userObject.start_date, userObject.job_description, userObject.is_active, userObject.password]);
        return rowData;
    } catch (error) {
        throw new Error(error);
    }
};

export const put = async(id: string, updateInfo: Partial<User>) => {
    try {
        const con = await connection();
        const userToUpdate = await getSingleUser(id);
        
        const [rowData] = await con.execute<RowDataPacket[]>('UPDATE Users SET `photo`=?, `user_name`=?, `job`=?, `email`=?, `contact`=?, `start_date`=?, `job_description`=?, `is_active`=?, `password`=? WHERE `id` = ?',
        [updateInfo.photo ? updateInfo.photo : userToUpdate.photo,
        updateInfo.user_name ? updateInfo.user_name : userToUpdate.user_name,
        updateInfo.job ? updateInfo.job : userToUpdate.job,
        updateInfo.email ? updateInfo.email : userToUpdate.email,
        updateInfo.contact ? updateInfo.contact : userToUpdate.contact,
        updateInfo.start_date ? updateInfo.start_date : userToUpdate.start_date,
        updateInfo.job_description ? updateInfo.job_description : userToUpdate.job_description,
        updateInfo.is_active ? updateInfo.is_active : userToUpdate.is_active,
        updateInfo.password ? updateInfo.password : bcrypt.hashSync(userToUpdate.password, 10),
        id]);
        const userUpdated = await getSingleUser(id);

        return userUpdated;
    } catch (error) {
        throw new Error(error);
    }
    
};

export const delUser = async(id: string) => {
    try {
        const con = await connection();
        con.execute('DELETE FROM Users WHERE `id` = ?', [id]);
    } catch (error) {
        throw new Error(error);
    }
};