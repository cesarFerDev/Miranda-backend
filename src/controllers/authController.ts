import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import 'dotenv/config';

type UserToken = {
    email: string
}

const authController = async(req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
  	'local',
  	async (error: Error, user: UserToken) => {
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
          	const body = { email: user.email };
          	const token = jwt.sign({ user: body }, process.env.SECRET_KEY!);  
          	return res.json({ token });
        	}
      	);
    	} catch (error) {
      		return next(error);
    	}
  	}
	)(req, res, next);
  };

  export default authController;