import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import 'dotenv/config';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTstrategy} from 'passport-jwt';
import {ExtractJwt as ExtractJWT} from 'passport-jwt';
import { connection } from "../sql/mysqlConnector";
import { connection as mongoConnection, disconnection} from "../mongo/mongoConnector"
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { UserModel } from '@src/mongoSchemas/userSchema';

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
		const isContained = await bcrypt.compare(password, userCandidate.password);
		if (isContained) {
			return email;
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
		//console.log(`Checkeala manin: ${checkUserInDatabase}`);
    	if (!checkUserInDatabase)
   			return done(null, {email: checkUserInDatabase});	 
    	// if (email === 'admin@admin.com' && password === 'admin')
   		// 	return done(null, {email: "admin@admin.com"});	 
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
