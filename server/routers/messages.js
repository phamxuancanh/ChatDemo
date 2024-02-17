const Message = require("../models/messages");
const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt_service");
const MessageController = require("../controllers/messages");
//add
//router.post("/addFile", MessageController.addFile);

router.post("/addMessage", verifyAccessToken, MessageController.addMessage);

router.put("/cancelMessage/:messageId", verifyAccessToken, MessageController.cancelMessage);

router.put("/readMessage/:messageId", verifyAccessToken, MessageController.readMessage);

//get
router.get("/:RoomID", verifyAccessToken, MessageController.getMessage);
//call
router.post("/callVideo", verifyAccessToken, MessageController.callVideo);

router.get("/getNewMessage/a", verifyAccessToken, MessageController.getNewMessage);

module.exports = router;
