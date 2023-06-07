import express from "express";

//const contactsController = require("../controllers/contactsController");
const contactsController = require("../controllers/contactsController-mongo");
const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);
contactsRouter.post("/", contactsController.postContact);
contactsRouter.put("/:id", contactsController.putContact);
//contactsRouter.delete("/:id", contactsController.deleteContact);

export default contactsRouter;