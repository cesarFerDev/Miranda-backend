import express from "express";

const bookingsController = require("../controllers/bookingsController");
//const bookingsController = require("../controllers/bookingsController-mongo");
const bookingsRouter = express.Router();

bookingsRouter.get("/", bookingsController.getAllBookings);
bookingsRouter.get("/:id", bookingsController.getBooking);
bookingsRouter.post("/", bookingsController.postBooking);
bookingsRouter.put("/:id", bookingsController.putBooking);
bookingsRouter.delete("/:id", bookingsController.deleteBooking);

export default bookingsRouter;