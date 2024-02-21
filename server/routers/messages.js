const Message = require("../models/messages");
const express = require("express");
const router = express.Router()
const { verifyAccessToken } = require("../helpers/jwt_service");
const MessageController = require("../controllers/messages");

//router.post("/addFile", MessageController.addFile);

//ok
router.post("/addMessage", verifyAccessToken, MessageController.addMessage);
//ok
router.put("/cancelMessage/:messageId", verifyAccessToken, MessageController.cancelMessage);
//ok
router.put("/readMessage/:messageId", verifyAccessToken, MessageController.readMessage);
//ok
router.get("/:RoomID", verifyAccessToken, MessageController.getMessage);

// router.post("/callVideo", verifyAccessToken, MessageController.callVideo);

//ok
router.get("/getNewMessage/a", verifyAccessToken, MessageController.getNewMessage);

module.exports = router;
