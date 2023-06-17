import express from "express";

const roomsController = require("../controllers/roomsController");
//const roomsController = require("../controllers/roomsController-mongo");
const roomsRouter = express.Router();

roomsRouter.get("/", roomsController.getAllRooms);
roomsRouter.get("/:id", roomsController.getSingleRoom);
roomsRouter.post("/", roomsController.postRoom);
roomsRouter.put("/:id", roomsController.putRoom);
roomsRouter.delete("/:id", roomsController.deleteRoom);

export default roomsRouter;