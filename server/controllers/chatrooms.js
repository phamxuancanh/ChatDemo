const User = require("../models/users");
const Message = require("../models/messages");
const Rooms = require("../models/chatrooms");
const mongoose = require("mongoose");

const addRoom = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const avatar = req.body.avatarGroup;
        const name = req.body.NameGroup;
        const ListUsers = req.body.ListUsers;
        let users = [];

        for (let i = 0; i < ListUsers.length; i++) {
            users.push(mongoose.Types.ObjectId(ListUsers[i]));
        }
        users.push(foundUser._id);
        const newRoom = new Rooms({
            name,
            users,
            group: true,
            avatar,
            roomMaster: foundUser._id,
        });
        const saveRoom = await newRoom.save();
        for (let i = 0; i < users.length; i++) {
            setTimeout(async () => {
                const u = await User.findOne({ _id: users[i] });
                if (u.socketId !== "") {
                    req.io.to(u.socketId).emit("join-room-group", saveRoom);
                }
            }, 200);
        }
        res.status(200).json(saveRoom);
    } catch (err) {
        next(err);
    }
};
const getRoomAfterLogin = async (req, res, next) => {
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
                _id: mongoose.Types.ObjectId(listMessage[i].RoomId)
            })
            listRoomSort.push(room)
        }
        listRoomSort = listRoomSort.concat(listNoMessage)
        res.status(200).json(listRoomSort);
    } catch (err) {
        next(err);
    }
};
const getRoomFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const Room = await Rooms.find({
            users: { $in: [foundUser._id] },
            group: false,
        });
        res.status(200).json(Room);
    } catch (err) {
        next(err);
    }
};
const getRoomGroup = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const Room = await Rooms.find({
            users: { $in: [foundUser._id] },
            group: true,
        });
        res.status(200).json(Room);
    } catch (err) {
        next(err);
    }
};
const getRoomByUserId = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        if (foundUser._id == req.params.userId) {
            const Room = await Rooms.find({
                users: { $in: [foundUser._id] },
            });
            res.status(200).json(Room);
        } else {
            const Room = await Rooms.find({
                users: { $in: [foundUser._id] },
            });
            res.status(200).json(Room);
        }
    } catch (err) {
        next(err);
    }
};
const getRoomById = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const roomId = req.params.RoomID;
        const Room = await Rooms.findOne({
            _id: roomId,
        });
        res.status(200).json(Room);
    } catch (err) {
        next(err);
    }
};
const getAllRooms = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const rooms = await Rooms.find({});
        res.status(200).json({ rooms });
    } catch (error) {
        next(error);
    }
};
const deleteRoom = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const roomId = req.params.RoomID;
        const roomSocket = await Rooms.findOne({ _id: roomId });
        const arrayUserInRooom = roomSocket.users;

        //socket cho minh khi ngta xóa ra khỏi nhóm
        arrayUserInRooom.forEach(async (user) => {
            const foundUserInRoom = await User.findOne({ _id: user });
            req.io.to(foundUserInRoom.socketId).emit("delete-group", roomSocket);
        });

        // const message = await Message.delete({
        //   RoomId: roomId
        // })

        const Room = await Rooms.deleteOne({
            _id: roomId,
            roomMaster: foundUser._id,
        });
        //socket cho tự bản thân mình xóa nhóm
        req.io.to(foundUser.socketId).emit("delete-group-by-me", roomSocket);

        if (Room) {
            return res.status(200).json({ message: "Room đã được xóa", Room });
        }
        res.status(403).json({ message: "Chỉ chủ phòng mới được phép xóa" });
    } catch (err) {
        next(err);
    }
};
const exitRoom = async (req, res, next) => {
    try {
        const id = req.body.id;
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        await Rooms.findOneAndUpdate(
            {
                _id: id,
                users: { $in: [foundUser._id] },
            },
            {
                $pull: {
                    users: { $in: [foundUser._id] },
                },
            }
        );
        const room = await Rooms.findOne({ _id: id });

        //socket sau khi tự bản thân rời nhóm
        req.io.to(foundUser.socketId).emit("exit-group-by-me", room);

        //socket cho mọi người khi có 1 người khác rời nhóm
        const arrayUserInRooom = room.users;
        arrayUserInRooom.forEach(async (user) => {
            const foundUserInRoom = await User.findOne({ _id: user });
            req.io.to(foundUserInRoom.socketId).emit("exit-group", room);
        });

        res.status(200).json({ message: "Thoát khỏi Room thành công", room });
    } catch (err) {
        next(err);
    }
};
const updateRoom = async (req, res, next) => {
    try {
        const id = req.params.RoomID;
        const name = req.body.name;
        const avatar = req.body.avatar;
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        await Rooms.findOneAndUpdate(
            {
                _id: id,
                users: { $in: [foundUser._id] },
            },
            {
                name: name,
                avatar: avatar,
            }
        );
        const room = await Rooms.findOne({ _id: id });
        //Socket bản thân tự cập nhật
        req.io.to(foundUser.socketId).emit("updateRooom-by-me", room);
        //socket cho mọi người khi có 1 đứa update
        const arrayUserInRooom = room.users;
        arrayUserInRooom.forEach(async (user) => {
            const foundUserInRoom = await User.findOne({ _id: user });
            req.io.to(foundUserInRoom.socketId).emit("updateRooom", room);
        });

        res.status(200).json({ message: "Room đã được cập nhật ", room });
    } catch (err) {
        next(err);
    }
};
const addMember = async (req, res, next) => {
    try {
        const id = req.body.id;
        const list_user_id = req.body.list_user_id;
        let list_user = [];
        for (let i = 0; i < list_user_id.length; i++) {
            list_user.push(new mongoose.Types.ObjectId(list_user_id[i]));
        }
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const findRoom = await Rooms.findOne({
            _id: id,
            users: { $in: [list_user] },
        });
        if (findRoom) {
            return res
                .status(403)
                .json({ error: { message: "Người này đã có trong group rồi" } });
        }
        await Rooms.findOneAndUpdate(
            {
                _id: id,
                users: { $in: [foundUser._id] },
            },
            {
                $addToSet: {
                    users: {
                        $each: list_user,
                    },
                },
            }
        );
        const room = await Rooms.findOne({ _id: id });
        //socket của người khác khi được ai đó thêm vào group
        list_user_id.forEach(async (userSelected) => {
            const foundUserSelected = await User.findOne({ _id: userSelected });
            req.io.to(foundUserSelected.socketId).emit("add-member", room);
        });
        //socket cho những người trong group khi ai đó được thêm vào
        const arrayUserInRooom = room.users;
        arrayUserInRooom.forEach(async (user) => {
            const foundMemberInRoom = await User.findOne({ _id: user });
            req.io
                .to(foundMemberInRoom.socketId)
                .emit("add-member-other-people-in-room", room);
        });
        res.status(200).json({ message: "Thêm Thành viên thành công", room });
    } catch (err) {
        console.log(err);
        next(err);
    }
};
const removeMember = async (req, res, next) => {
    try {
        const { id,  userWantRemove    } = req.body;
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        await Rooms.findOneAndUpdate(
            {
                _id: id,
                roomMaster: foundUser._id,
            },
            {
                $pull: {
                    users: { $in: [new mongoose.Types.ObjectId(userWantRemove)] },
                },
            }
        );
        const room = await Rooms.findOne({ _id: id });
        const foundUserBeRemoved = await User.findOne({ _id: userWantRemove });

        //socket cho người bị mời ra khỏi nhóm
        req.io
            .to(foundUserBeRemoved.socketId)
            .emit("removed-by-other-person", room);

        //socket cho các thành viên còn lại khi có người bị mời ra khỏi nhóm
        const arrayUserInRooom = room.users;
        arrayUserInRooom.forEach(async (user) => {
            const foundUserInRoom = await User.findOne({ _id: user });
            req.io
                .to(foundUserInRoom.socketId)
                .emit("remove-member-other-people", room);
        });

        res.status(200).json({ message: "Thoát khỏi Room thành công", room });
    } catch (err) {
        console.log(err);
        next(err);
    }
};
const swapRoomMaster = async (req, res, next) => {
    try {
        const { id, userWantSwap } = req.body;
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        await Rooms.findOneAndUpdate(
            {
                _id: id,
            },
            {
                roomMaster: new mongoose.Types.ObjectId(userWantSwap),
            }
        );
        const room = await Rooms.findOne({ _id: id });

        //socket khi trưởng nhóm chuyển nhóm trưởng
        req.io.to(foundUser.socketId).emit("swapRoomMaster-by-me", room);

        //socket cho mọi ngừ khi nhóm trưởng chuyển nhóm trưởng
        const arrayUserInRooom = room.users;
        arrayUserInRooom.forEach(async (user) => {
            const foundUserInRoom = await User.findOne({ _id: user });
            req.io.to(foundUserInRoom.socketId).emit("swapRoomMaster", room);
        });

        res.status(200).json({ message: "Chuyển nhóm trưởng thành công", room });
    } catch (err) {
        next(err);
    }
};

const getRoomByNameRoom = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const { name } = req.body;
        const regex = new RegExp(name, "i"); // "i" để tìm kiếm không phân biệt chữ hoa chữ thường
        const room = await Rooms.find({
            name: regex, // thay thế $text bằng $regex
            group: true,
        });
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
};

//
const getRoomByNameFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const { name } = req.body;
        // Tìm kiếm người dùng theo tên mà không sử dụng chỉ mục
        const users = await User.find({
            name: { $regex: new RegExp(name, "i") }, // Tìm kiếm không phân biệt hoa thường
            friends: { $in: [foundUser._id] },
        });
        let room = [];
        for (let i = 0; i < users.length; i++) {
            // Tìm kiếm phòng dựa trên người dùng và không sử dụng chỉ mục
            const foundRoom = await Rooms.findOne({
                users: { $all: [foundUser._id, users[i]._id] },
                group: false,
            });
            room.push(foundRoom);
        }
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
};


module.exports = {
    addRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    getRoomAfterLogin,
    getRoomByUserId,
    addMember,
    exitRoom,
    getRoomFriend,
    getRoomGroup,
    removeMember,
    swapRoomMaster,
    getRoomByNameRoom,
    getRoomByNameFriend,
};
