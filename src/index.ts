import express from 'express';
import passport from 'passport';
import bookingsRouter from './routers/BookingsRouter';
import contactsRouter from './routers/ContactsRouter';
import roomsRouter from './routers/RoomsRouter';
import usersRouter from './routers/UsersRouter';
import authRouter from './routers/authRouter';
import publicRouter from './routers/publicRouter';
import cors from "cors";
import './auth/auth';
import 'dotenv/config';


const app = express();

app.use(express.json());
app.use(cors());

app.use('/login', authRouter);
app.use('/', publicRouter);

app.use('/api/bookings', passport.authenticate('jwt', { session: false }), bookingsRouter);
app.use('/api/contacts', passport.authenticate('jwt', { session: false }), contactsRouter);
app.use('/api/rooms', passport.authenticate('jwt', { session: false }), roomsRouter);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});