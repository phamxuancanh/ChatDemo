const Rooms = require("../models/chatrooms");
const express = require("express");
const router = express.Router();
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt_service");
const RoomController = require("../controllers/chatrooms");
//ok
router.get(
    "/getRoomAfterLogin",
    verifyAccessToken,
    RoomController.getRoomAfterLogin
);
//ok
router.get("/getRoomFriend", verifyAccessToken, RoomController.getRoomFriend);
//ok
router.get("/getRoomGroup", verifyAccessToken, RoomController.getRoomGroup);
//ok
router.post("/removeMember", verifyAccessToken, RoomController.removeMember);
//ok
router.post("/addRoom", verifyAccessToken, RoomController.addRoom);
//ok
router
    .route("/:RoomID")
    .get(verifyAccessToken, RoomController.getRoomById)
//ok
    .put(verifyAccessToken, RoomController.updateRoom)
//ok
    .delete(verifyAccessToken, RoomController.deleteRoom);
//ok
router.get(
    "/getRoomByUserId/:userId",
    verifyAccessToken,
    RoomController.getRoomByUserId
); 
//ok
router.post("/addMembers", verifyAccessToken, RoomController.addMember);
//ok
router.post("/exit", verifyAccessToken, RoomController.exitRoom);
//ok
router.get("/", verifyAccessToken, RoomController.getAllRooms);
//ok
router.post(
    "/swapRoomMaster",
    verifyAccessToken,
    RoomController.swapRoomMaster
);
//ok
router.post(
    "/getRoomByNameRoom",
    verifyAccessToken,
    RoomController.getRoomByNameRoom
);
//ok
router.post(
    "/getRoomByNameFriend",
    verifyAccessToken,
    RoomController.getRoomByNameFriend
);

module.exports = router;
