import mysql from "mysql2/promise";
import 'dotenv/config';

const options = {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_DB_PASS,
    database: "mirandahoteldb"
};

export const connection = async() => {
    return await mysql.createConnection(options);
};