const express = require("express");
const router = express.Router()
//const router = require("express-promise-router")();
const AuthsRouter = require("./auth");
const UsersRouter = require("./users");
const UsersRequestRouter = require("./user_request");
const RoomsRouter = require("./chatrooms");
const MessageRouter = require("./messages");
router.use("/auth", AuthsRouter);
router.use("/users", UsersRouter);
router.use("/user_request", UsersRequestRouter);
router.use("/chatrooms", RoomsRouter);
router.use("/messages", MessageRouter);

module.exports = router;
