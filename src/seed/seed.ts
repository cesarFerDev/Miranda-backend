import {faker} from '@faker-js/faker';
import { Booking, Room, Contact, User } from '../interfaces/interfaces';
import {post as bookingsPost} from "../repositories/bookingsRepository/bookingsRepository-sql";
import {post as roomsPost} from "../repositories/roomsRepository/roomsRepository-sql";
import {post as usersPost} from "../repositories/usersRepository/usersRepository-sql";
import {post as contactsPost} from "../repositories/contactsRepository/contactsRepository-sql";
import { connection } from "../sql/mysqlConnector";
import { RowDataPacket } from 'mysql2';

export const getRandomValue = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)];
};

const createBookings = async() => {
    const con = await connection();
    const [values] = await con.execute<RowDataPacket[]>('SELECT `id` FROM Rooms');
    const status = ['Check In', 'Check Out', 'In Progress'];
    
    for (let i = 0; i < 10; i++) {
        const fakeBooking: Booking = {
            guest_name: faker.person.fullName(),
            guest_email: faker.internet.email(),
            guest_contact: faker.phone.number(),
            order_date: faker.date.future().toISOString().slice(0, 19).replace('T', ' '),
            check_in: faker.date.future().toISOString().slice(0, 19).replace('T', ' '),
            check_out: faker.date.future().toISOString().slice(0, 19).replace('T', ' '),
            special_request: faker.lorem.words(20),
            room_id: await getRandomValue(values).id,
            status: getRandomValue(status)
        };
        await bookingsPost(fakeBooking);
    };
};

const createRooms = async() => {
    const roomType = [
        {
            type: 'Single Bed', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV","Single Bed"]
        },
        {
            type: 'Double Bed', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV","Mini-fridge","Double Bed"]
        },
        {
            type: 'Double Superior', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV","Mini-fridge","Hairdryer", "Bathrobe and slippers", "Double Bed"]
        },
        {
            type: 'Suite', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV","Mini-fridge","Hairdryer", "Coffee maker", "Ironing board", "Balcony", "King Bed"]
        }
    ]
    for (let i = 0; i < 10; i++) {
        const roomRandomAssign = getRandomValue(roomType);
        const fakeRoom: Room = {
            type: roomRandomAssign.type,
            number: faker.number.int({ max: 500 }),
            price: Number(faker.number.float({ max: 1000, precision: 0.01 })),
            discount: faker.number.int({ min:0, max: 100 }),
            cancellation: faker.lorem.words(20),
            description: faker.lorem.words(20),
            amenities: roomRandomAssign.amenities,
            photos: [
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                "https://images.unsplash.com/photo-1635350644128-c8e41eb8b2a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                "https://images.unsplash.com/photo-1623050804066-42bcedb4e81d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
              ],
            is_available: true
        }

        await roomsPost(fakeRoom);
    };
};

const createUsers = async() => {
    const job = ['Manager', 'Receptionist', 'Room Service'];
    const admin: User = {
        photo: "https://f4.bcbits.com/img/0025239196_25.jpg",
        user_name: "Admin",
        job: "Manager",
        email: "admin@admin.com",
        contact: "000000000",
        start_date: "2023-06-02 00:00:00",
        job_description: "Admin",
        is_active: false,
        password: "admin"
    };
    await usersPost(admin); 
    for (let i = 1; i < 10; i++) {
        const fakeUser: User = {
            photo: faker.internet.avatar(),
            user_name: faker.person.fullName(),
            job: getRandomValue(job),
            email: faker.internet.email(),
            contact: faker.phone.number(),
            start_date: faker.date.recent().toISOString().slice(0, 19).replace('T', ' '),
            job_description: faker.lorem.words(20),
            is_active: true,
            password: faker.internet.password()
        };

        await usersPost(fakeUser);
    };
};

const createContacts = async() => {

    for (let i = 0; i < 10; i++) {
        const fakeContact: Contact = {
            contact_date: faker.date.recent().toISOString().slice(0, 19).replace('T', ' '),
            guest_name: faker.person.fullName(),
            guest_email: faker.internet.email(),
            guest_contact: faker.phone.number(),
            content_title: faker.lorem.sentence(3),
            content_text: faker.lorem.words(20),
            is_archived: false
        };

        await contactsPost(fakeContact); 
    };
};

const createData = async() => {
    await createRooms();
    await Promise.all([
        await createUsers(),
        await createContacts(),
        await createBookings()
    ])
};

createData();