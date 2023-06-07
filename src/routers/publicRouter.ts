import express, {Request, Response} from "express";

const publicRouter = express.Router()

publicRouter.get('/', (req: Request, res: Response) => {
    res.send({
        name: "HOTEL MIRANDA",
        endpoints: [{
            Bookings: "GET/GET(single)/POST/PUT/DELETE",
            Rooms: "GET/GET(single)/POST/PUT/DELETE",
            Contacts: "GET/POST/PUT/DELETE",
            Users: "GET/GET(single)/POST/PUT/DELETE",
        }]
    }) 
})

export default publicRouter;