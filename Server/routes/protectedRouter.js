const { Router } = require("express");
const protectedRouter = Router();
const protectedController = require('../controller/protectedController.js');
const friendsController = require('../controller/friendsController.js');
const profileController = require("../controller/profileController.js")
const { authenticateUser } = require("../utills/middlewares.js");

protectedRouter.get("/profile", authenticateUser, profileController.getProfile);
protectedRouter.put("/password", authenticateUser, profileController.putChangePassword);
protectedRouter.delete("/kill", authenticateUser, profileController.deleteUser);

protectedRouter.get("/contacts", authenticateUser, protectedController.getContacts);
protectedRouter.post("/conversation", authenticateUser, protectedController.postConversation);
protectedRouter.get("/conversation", authenticateUser, protectedController.getConversations);
protectedRouter.post("/oldmsg", authenticateUser, protectedController.postOlderMessages);

protectedRouter.post("/friendreq", authenticateUser, friendsController.postAddFreind);
protectedRouter.get("/pending", authenticateUser, friendsController.getPending);
protectedRouter.put("/friendreq", authenticateUser, friendsController.acceptFriendRequest);
protectedRouter.delete("/friendreq", authenticateUser, friendsController.deleteFriendRequest);

module.exports = protectedRouter;