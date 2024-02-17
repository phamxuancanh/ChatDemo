const Rooms = require("../models/chatrooms");
const express = require("express");
const router = express.Router();
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt_service");
const RoomController = require("../controllers/chatrooms");

//get Room after Login
router.get(
    "/getRoomAfterLogin",
    verifyAccessToken,
    RoomController.getRoomAfterLogin
);
router.get("/getRoomFriend", verifyAccessToken, RoomController.getRoomFriend);

router.get("/getRoomGroup", verifyAccessToken, RoomController.getRoomGroup);

router.post("/removeMember", verifyAccessToken, RoomController.removeMember);
//new room
router.post("/addRoom", verifyAccessToken, RoomController.addRoom);
//get Room byRoomID
router
    .route("/:RoomID")
    .get(verifyAccessToken, RoomController.getRoomById)
    .put(verifyAccessToken, RoomController.updateRoom)
    .delete(verifyAccessToken, RoomController.deleteRoom);
//get List Room by UserID
router.get(
    "/getRoomByUserId/:userId",
    verifyAccessToken,
    RoomController.getRoomByUserId
);

router.post("/addMembers", verifyAccessToken, RoomController.addMember);

router.post("/exit", verifyAccessToken, RoomController.exitRoom);

//get ALL ROOMS
router.get("/", verifyAccessToken, RoomController.getAllRooms);

router.post(
    "/swapRoomMaster",
    verifyAccessToken,
    RoomController.swapRoomMaster
);

router.post(
    "/getRoomByNameRoom",
    verifyAccessToken,
    RoomController.getRoomByNameRoom
);

router.post(
    "/getRoomByNameFriend",
    verifyAccessToken,
    RoomController.getRoomByNameFriend
);

module.exports = router;
