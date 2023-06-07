import {Router} from "express";
//const usersController = require("../controllers/usersController");
const usersController = require("../controllers/usersController-mongo");
const usersRouter = Router();

usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/:id", usersController.getSingleUser);
usersRouter.post("/", usersController.postUser);
usersRouter.put("/:id", usersController.putUser);
usersRouter.delete("/:id", usersController.deleteUser);

export default usersRouter;