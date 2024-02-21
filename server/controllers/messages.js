const multer = require("multer");
const path = require("path");
// const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const Message = require("../models/messages");
const User = require("../models/users");
const Rooms = require("../models/chatrooms");
const express = require("express");
const { log } = require("console");
const router = express.Router();
const dotenv = require("dotenv").config();
//const Buffer = require("buffer");
//const getStream = require('get-stream')

const mongoose = require("mongoose");

// const s3 = new AWS.S3({
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
// });
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, "");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage, limits: { fileSize: 20000000 } }).single(
    "uploadFile"
);

const addMessage = async (req, res, next) => {
    try {
        console.log(req.body);
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const { RoomId, text, type, nameFile } = req.body;
        const room = await Rooms.findOne({ _id: RoomId });
        if (room.active == true) {
            req.io.to(RoomId).emit("send-message", {
                RoomId: RoomId,
                text: text,
                nameFile: nameFile,
                sender: foundUser._id,
                type: type,
                active: true,
            });
            const savedMessage = await Message.create({
                RoomId: RoomId,
                text: text,
                nameFile: nameFile,
                sender: foundUser._id,
                type: type,
                active: true,
            });
            return res.status(200).json(savedMessage);
        }

        res.status(400).json({ message: "Không thể Gửi được tin nhắn" });
    } catch (err) {
        next(err);
    }
};
// const addFile = async (req, res, next) => {

//     console.log("AAAAA");
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(500).json("LOI NEK");
//         }
//         console.log(req.file);
//         const uploadFile = req.file.originalname.split(".");
//         const filesTypes = uploadFile[uploadFile.length - 1];
//         const filePath = `${uuid() + Date.now().toString()}.${filesTypes}`;
//         const params = {
//             // Body : await getStream(req.file.stream),
//             Body: req.file.buffer,
//             Bucket: "bucketfort2tiet46",
//             Key: filePath,
//             ACL: "public-read",
//             ContentType: req.file.mimetype,
//         };
//         console.log("dòng 76");
//         s3.upload(params, (error, data) => {
//             if (error) return res.send("LOI");
//             console.log("AAAA");
//             return res.status(200).send(data.Location);
//         });
//     });
// };
const cancelMessage = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const message = await Message.findOne({
            _id: req.params.messageId,
        });
        message.active = false;
        await message.save();

        req.io.to(message.RoomId).emit("CancelMessage", message);

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};

const readMessage = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const message = await Message.findOne({
            _id: req.params.messageId,
        });
        // if (foundUser._id.value === message.sender.value) {
        //   return res.status(200).json(message);
        // }
        message.readMessage = true;
        await message.save();

        // req.io.to(message.RoomId)
        //   .emit('CancelMessage', message)

        res.status(200).json(message);
    } catch (err) {
        next(err);
    }
};

const getMessage = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const messages = await Message.find({
            RoomId: req.params.RoomID,
        });
        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
};
// RTC
// const callVideo = async (req, res, next) => {
//     try {
//         const foundUser = await User.findOne({ _id: req.payload.userId });
//         if (!foundUser) {
//             return res
//                 .status(403)
//                 .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
//         }
//         const { RoomId } = req.body;

//         const room = await Rooms.findOne({ _id: RoomId });
//         const nameMessUserId = room.users.find(
//             (m) => m != foundUser._id.toString()
//         );
//         const userAnother = await User.findOne({ _id: nameMessUserId });
//         // -------------------------------------------
//         req.io.to(foundUser.socketId).emit("me", foundUser.socketId, userAnother);

//         // -------------------------------------------
//         //  console.log(userAnother + " user ngừ khec");
//         //  console.log(nameMessUserId + " Userid ngừ khec");
//         // console.log(nameMessUserId + "ID NGỪ KHEC" + foundUser._id);
//         if (room.active == true) {
//             console.log("Đã zô tới đây " + foundUser.socketId);
//             return res.status(200).json({});
//         }

//         res.status(401).json({ message: "Không thể gọi video" });
//     } catch (err) {
//         next(err);
//     }
// };

const getNewMessage = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const listRoom = await Rooms.find({
            users: { $in: [foundUser._id] },
        });
        console.log(listRoom.length)
        let listMessage = []
        let listRoomSort = []
        let listNoMessage = []
        for (let i = 0; i < listRoom.length; i++) {
            const messages = await Message.find({
                RoomId: listRoom[i]._id,
            }).sort({ createdAt: -1 }).limit(1);

            if (messages.length !== 0) {
                listMessage.push(messages[0])
            } else {
                listNoMessage.push(listRoom[i])
            }
        }
        listMessage.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1)

        for (let i = 0; i < listMessage.length; i++) {
            const room = await Rooms.findOne({
                _id: new mongoose.Types.ObjectId(listMessage[i].RoomId)
            })
            listRoomSort.push(room)

        }
        listRoomSort = listRoomSort.concat(listNoMessage)
        res.status(200).json(listRoomSort);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addMessage,
    // addFile,
    cancelMessage,
    readMessage,
    getMessage,
//    callVideo,
    getNewMessage
};