import { JwtPayload } from 'jsonwebtoken';
import passport, { use } from 'passport';
import 'dotenv/config';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTstrategy} from 'passport-jwt';
import {ExtractJwt as ExtractJWT} from 'passport-jwt';
import { connection } from "../sql/mysqlConnector";
import { connection as mongoConnection, disconnection} from "../mongo/mongoConnector"
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { UserModel } from '../mongoSchemas/userSchema';
import { idConverter } from '@src/repositories/bookingsRepository/bookingsRepository-mongo';
import { User } from '@src/interfaces/interfaces';

// export interface UserLogged {
// 	photo: string,
// 	name: string,
// 	email: string
// }
export interface UserLogged {
	id: string,
	email: string
}

const checkUserLoginSQL = async(email: string, password: string) => {
	const con = await connection();
	const [rowData] = await con.execute<RowDataPacket[]>('SELECT * FROM Users WHERE `email` = ?', [email]);

	const isContained = await bcrypt.compare(password, rowData[0].password);

	if (isContained) {
		return email;
	}
	return "";
}

const checkUserLoginMongo = async(email: string, password: string) => {
	await mongoConnection();
	const userCandidate = await UserModel.findOne()
		.where("email")
		.equals(email)
		.exec()
	
	if (userCandidate) {
		const userParse = idConverter(userCandidate) as User;
		const isContained = await bcrypt.compare(password, userParse.password);
		if (isContained) {
			// const userInfo = {
			// 	photo: userCandidate.photo,
			// 	name: userCandidate.user_name,
			// 	email: userCandidate.email
			// };
			const userInfo = {
				id: userParse.id,
				email: userParse.email
			};
			return userInfo;
		}
	}
	return "";
}

passport.use(
  new localStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	async (email: string, password: string, done) => {
  	try {
		const checkUserInDatabase = await checkUserLoginMongo(email, password);
    	if (checkUserInDatabase !== "")
   			return done(null, checkUserInDatabase);	  
  		return done(null, false);
  	} catch (error) {
    	return done(error);
  	}
}));


passport.use(
  new JWTstrategy(
	{
  	secretOrKey: process.env.SECRET_KEY!,
  	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
	},
	async (token: JwtPayload, done) => {
  	try {
    	return done(null, token.user);
  	} catch (error) {
    	done(error);
  	}
	}
  )
);
