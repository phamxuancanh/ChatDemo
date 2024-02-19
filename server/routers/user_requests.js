const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt_service");
const UserRequestController = require("../controllers/user_requests")
//OK
router
    .route("/checkSendRequest/:userID")
    .get(verifyAccessToken, UserRequestController.checkSendRequest);
//OK
router.get("/getListSenderRequest", verifyAccessToken, UserRequestController.getListSenderRequest);
//OK
router.get("/getListReceiver", verifyAccessToken, UserRequestController.getListReceiver);

module.exports = router;