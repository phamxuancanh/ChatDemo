const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const AuthsRouter = require("./auth");
const UsersRouter = require("./users");
const UsersRequestRouter = require("./user_requests");
const RoomsRouter = require("./chatrooms");
const MessageRouter = require("./messages");
router.use("/api/auth", AuthsRouter);
router.use("/api/users", UsersRouter);
router.use("/api/user_request", UsersRequestRouter);
router.use("/api/chatrooms", RoomsRouter);
router.use("/api/messages", MessageRouter);

module.exports = router;
