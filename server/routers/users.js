const express = require("express");
const router = express.Router();
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt_service");
const UserController = require("../controllers/users");

const {
    validateBody,
    validateParam,
    schemas,
} = require("../helpers/user_validate");
//ok
router
    .route("/GetUserAfterLogin")
    .get(verifyAccessToken, UserController.GetUserAfterLogin);
//ok
router
    .route("/checkFriend/:userID")
    .get(verifyAccessToken, UserController.checkFriend);
//ok
router
    .route("/GetUserByName")
    .post(verifyAccessToken, UserController.GetUserByName);
//ok
router
    .route("/GetUserByPhone")
    .post(verifyAccessToken, UserController.GetUserByPhone);
//ok
router
    .route("/cancelSendedFriend")
    .post(verifyAccessToken, UserController.cancelSendedFriend);
//ok
router
    .route("/requestAddFriend")
    .post(verifyAccessToken, UserController.requestAddFriend);
//ok
router
    .route("/acceptFriend")
    .post(verifyAccessToken, UserController.acceptFriend);
//ok
router
    .route("/declineFriend")
    .post(verifyAccessToken, UserController.declineFriend);
//ok
router
    .route("/blockFriend")
    .post(verifyAccessToken, UserController.blockFriend);
//ok
router
    .route("/deleteFriend")
    .post(verifyAccessToken, UserController.deleteFriend);
//OK
router
    .route("/:userID")
    .get(validateParam(schemas.idSchema, "userID"), UserController.getUser)

    .put(
        validateParam(schemas.idSchema, "userID"),
        // validateBody(schemas.userSchema),
        UserController.replaceUser
    )
    .patch(
        validateParam(schemas.idSchema, "userID"),
        validateBody(schemas.userOptionalSchema),
        UserController.updateUser
    )
    .delete(validateParam(schemas.idSchema, "userID"), UserController.deleteUser);
//OK !!
router
    .route("/")
    .get(verifyAccessToken, UserController.getAllUser)
    // .post(validateBody(schemas.userSchema), UserController.newUser);
    .post(UserController.newUser);
//OK !!
router
    .route("/GetFriendByName")
    .post(verifyAccessToken, UserController.GetFriendByName);
//OK !!
router
    .route("/GetFriendByPhone")
    .post(verifyAccessToken, UserController.GetFriendByPhone);
module.exports = router;
