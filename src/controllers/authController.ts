import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import 'dotenv/config';
import { UserLogged } from "@src/auth/auth";

type UserToken = {
    email: string
}

const authController = async(req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
  	'local',
  	async (error: Error, user: UserLogged) => {
    	try {
			if (error || !user) {
				const error = new Error('An error occurred.');
				return next(error);
			}

      	req.login(
        	user,
        	{ session: false },

        	async (error) => {
          	if (error) {
				return next(error);
			} 
          	//const body = { user };
          	const token = jwt.sign({ user: user.email }, process.env.SECRET_KEY!); 
          	return res.json({token: token, id: user.id});
        	}
      	);
    	} catch (error) {
      		return next(error);
    	}
  	}
	)(req, res, next);
  };

  export default authController;