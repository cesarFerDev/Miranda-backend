import {faker} from '@faker-js/faker';
import { post as bookingsPost } from "../repositories/bookingsRepository/bookingsRepository-mongo";
import { post as contactsPost } from '../repositories/contactsRepository/contactsRepository-mongo';
import { post as roomsPost, put as roomsPut } from '../repositories/roomsRepository/roomsRepository-mongo';
import { post as usersPost } from '../repositories/usersRepository/usersRepository-mongo';
import { getRandomValue } from './seed';
import { MongoBooking } from '../mongoSchemas/bookingSchema';
import { MongoContact } from '../mongoSchemas/contactSchema';
import { MongoRoom } from '../mongoSchemas/roomSchema';
import { MongoUser } from '../mongoSchemas/userSchema';
import { get as getRooms } from '../repositories/roomsRepository/roomsRepository-mongo';
import { connection, disconnection } from '../mongo/mongoConnector';

const setBookingStatus = (check_in: string, check_out: string) => {
    const today = new Date().getTime();
    if (Date.parse(check_out) < today) {
        return "Check Out"
    } else if ((Date.parse(check_in) < today) && (Date.parse(check_out) > today)) {
        return "In Progress"
    } else {
        return "Check In"
    }
}


const createBookings = async() => {
    const firstDatePool = [1,2,3,4];
    const secondDatePool = [5,6,7,8];
    const status = ['Check In', 'Check Out', 'In Progress'];
    const rooms = await getRooms();
    for (let i = 0; i < 50; i++) {
        const fakeBooking: MongoBooking = {
            guest_name: faker.person.fullName(),
            guest_email: faker.internet.email(),
            guest_contact: faker.number.int({ min: 600000000, max: 799999999 }).toString(),
            order_date: faker.date.soon().toISOString().slice(0, 10).replace('T', ' '),
            check_in: faker.date.soon(getRandomValue(firstDatePool)).toISOString().slice(0, 10).replace('T', ' '),
            check_out: faker.date.soon(getRandomValue(secondDatePool)).toISOString().slice(0, 10).replace('T', ' '),
            special_request: faker.lorem.words(20),
            room_id: getRandomValue(rooms).id,
            status: getRandomValue(status)
        };
        await roomsPut(fakeBooking.room_id, {is_available: false})
        await bookingsPost(fakeBooking);
    };
};

const createRooms = async() => {
    const roomMainPhotoPool = [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=958&q=80",
        "https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1631049552240-59c37f38802b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ]
    const roomType = [
        {
            type: 'Single Bed', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV", "Coffee maker", "Single Bed"]
        },
        {
            type: 'Double Bed', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV", "Coffee maker", "Double Bed"]
        },
        {
            type: 'Double Superior', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV","Mini-fridge","Coffee maker","Balcony", "Double Bed"]
        },
        {
            type: 'Suite', 
            amenities: ["Free Wi-Fi", "Air conditioning","Flat-screen TV","Mini-fridge","Hairdryer", "Coffee maker", "Balcony", "King Bed"]
        }
    ]
    for (let i = 0; i < 25; i++) {
        const roomRandomAssign = getRandomValue(roomType);
        const fakeRoom: MongoRoom = {
            type: roomRandomAssign.type,
            number: faker.number.int({ max: 500 }),
            price: Number(faker.number.float({ max: 1000, precision: 0.01 })),
            discount: faker.number.int({ min:0, max: 100 }),
            cancellation: faker.lorem.words(20),
            description: faker.lorem.words(20),
            amenities: roomRandomAssign.amenities,
            photos: [
                getRandomValue(roomMainPhotoPool),
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
    const admin: MongoUser = {
        photo: "https://f4.bcbits.com/img/0025239196_25.jpg",
        user_name: "Admin",
        job: "Manager",
        email: "admin@admin.com",
        contact: "000000000",
        start_date: "2023-06-05",
        job_description: "Admin",
        is_active: false,
        password: "admin"
    };
    const test: MongoUser = {
        photo: "https://f4.bcbits.com/img/0025239196_25.jpg",
        user_name: "Test User",
        job: "Manager",
        email: "test@admin.com",
        contact: "000000000",
        start_date: "2023-06-15",
        job_description: "Sandbox",
        is_active: false,
        password: "test"
    };
    await usersPost(admin);
    await usersPost(test);
    for (let i = 2; i < 20; i++) {
        const fakeUser: MongoUser = {
            photo: faker.internet.avatar(),
            user_name: faker.person.fullName(),
            job: getRandomValue(job),
            email: faker.internet.email(),
            contact: faker.number.int({ min: 600000000, max: 799999999 }).toString(),
            start_date: faker.date.soon().toISOString().slice(0, 10).replace('T', ' '),
            job_description: faker.lorem.words(20),
            is_active: true,
            password: faker.internet.password()
        };

        await usersPost(fakeUser);
    };
};

const createContacts = async() => {
    for (let i = 0; i < 50; i++) {
        const fakeContact: MongoContact = {
            contact_date: faker.date.recent().toISOString().slice(0, 10).replace('T', ' '),
            guest_name: faker.person.fullName(),
            guest_email: faker.internet.email(),
            guest_contact: faker.number.int({ min: 600000000, max: 799999999 }).toString(),
            content_title: faker.lorem.sentence(3),
            content_text: faker.lorem.words(20),
            is_archived: false
        };

        await contactsPost(fakeContact); 
    };
};

export const createData = async() => {
    await connection();
    await createRooms();
    await Promise.all([
        await createUsers(),
        await createContacts(),
        await createBookings()
    ]);
    await disconnection();
};

createData();