const User = require("../models/users");
const UserRequest = require("../models/user_requests");
const Rooms = require("../models/chatrooms");
const mongoose = require("mongoose");
const FilterUserData = require("../utils/FilterUserData");
const bcrypt = require("bcryptjs");
//lấy danh sách người dùng
const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({ users }); s
    } catch (error) {
        next(error);
    }
};
//thêm người dùng
const newUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(newUser.password, salt);
        // Re-assign password hashed
        const newPassword = passwordHashed;
        newUser.password = newPassword;
        await newUser.save();
        res.status(200).json({ newUser });
    } catch (error) {
        next(error);
    }
};
//lấy người dùng theo id
const getUser = async (req, res, next) => {
    try {
        const id = req.params.userID;
        console.log("NEK", id);
        const users = await User.findOne({ _id: id });
        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};
//cập nhập người dùng
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.userID;
        const newUser = req.body;
        const result = await User.findByIdAndUpdate(id, newUser);
        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
//thay thế người dùng
const replaceUser = async (req, res, next) => {
    try {
        const id = req.params.userID;
        const newUser = req.body;
        const result = await User.findByIdAndUpdate(id, newUser);
        return res.status(200).json({ success: true, newUser });
    } catch (error) {
        next(error);
    }
};
//xóa người dùng
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.userID;
        await User.deleteOne({ _id: id });
        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
//  gửi yêu cầu kết bạn
const requestAddFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        const { id_UserWantAdd } = req.body;
        console.log(foundUser);
        if (!foundUser)
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập" } });
        if (foundUser._id == id_UserWantAdd) {
            return res
                .status(400)
                .json({ error: "Bạn không thể gửi yêu cầu kết bạn cho chính mình" });
        }
        if (foundUser.friends.includes(id_UserWantAdd)) {
            return res.status(400).json({ error: "đã là bạn" });
        }
        const friendRequest = await UserRequest.findOne({
            sender: foundUser._id,
            receiver: id_UserWantAdd,
        });
        if (friendRequest) {
            return res.status(400).json({ error: "Yêu cầu kết bạn đã được gửi" });
        }
        const newFriendRequest = new UserRequest({
            sender: foundUser._id,
            receiver: id_UserWantAdd,
        });
        const save = await newFriendRequest.save();
        const friend = await UserRequest.findById(save.id).populate("receiver");
        console.log(friend);
        const chunkData = {
            id: friend.id,
            user: FilterUserData(friend.receiver),
        };

        if (friend.receiver.socketId) {
            console.log("Có online nha " + friend.receiver.name);
            req.io
                .to(friend.receiver.socketId)
                .emit("friend-request-status", foundUser);
        }
        req.io.to(foundUser.socketId).emit("my-request-to-friend", friend);

        res
            .status(200)
            .json({ message: "Yêu cầu kết bạn đã được gửi", friend: chunkData });
    } catch (error) {
        next(error);
    }
};
//hủy yêu cầu kết bạn
const cancelSendedFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const friendsRequest = await UserRequest.findById(
            req.body.requestId
        ).populate("receiver");
        // console.log(friendsRequest);
        if (!friendsRequest) {
            return res
                .status(404)
                .json({ error: "Yêu cầu đã bị hủy hoặc chưa được gửi" });
        }
        await UserRequest.deleteOne({ _id: req.body.requestId });

        req.io
            .to(friendsRequest.receiver.socketId)
            .emit("cancel-friend-request", foundUser);
        res.status(200).json({ message: "Yêu cầu kết bạn đã bị hủy" });
    } catch (error) {
        next(error);
    }
};
//chấp nhận yêu cầu kết bạn
const acceptFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const friendsRequest = await UserRequest.findById(req.body.requestId);

        const currentUser = await User.findById(req.payload.userId);

        if(currentUser._id.equals(friendsRequest.sender)) {
            return res 
                .status(400)
                .json({ error: "Bản thân không thể tự chấp nhận lời mời kết bạn" });
        }
        console.log(currentUser._id);
        console.log(friendsRequest.receiver);
        if(!currentUser._id.equals(friendsRequest.receiver)) {
            return res 
                .status(400)
                .json({ error: "Người đang đăng nhập không phải người được gửi" });
        }
        if (!friendsRequest) {
            return res
                .status(404)
                .json({ error: "Yêu cầu đã được chấp nhận hoặc chưa được gửi" });
        }
        const sender = await User.findById(friendsRequest.sender);
        // console.log(sender.friends);

        if (sender.friends.includes(friendsRequest.receiver)) {
            return res
                .status(400)
                .json({ error: "đã có trong danh sách bạn bè của bạn" });
        }
        sender.friends.push(req.payload.userId);
        await sender.save();
        // const currentUser = await User.findById(req.payload.userId);
        if (currentUser.friends.includes(friendsRequest.sender)) {
            return res.status(400).json({ error: "đã kết bạn rồi" });
        }
        currentUser.friends.push(friendsRequest.sender);
        await currentUser.save();
        const chunkData = FilterUserData(sender);
        await UserRequest.deleteOne({ _id: req.body.requestId });
        const listUsers = [currentUser._id, sender._id];
        const checkRoom = await Rooms.findOne({
            users: { $all: [currentUser._id, sender._id] },
            group: false,
        });
        if (checkRoom) {
            await Rooms.findOneAndUpdate(
                {
                    users: { $all: [currentUser._id, sender._id] },
                    group: false,
                },
                {
                    active: true,
                }
            );
            return res
                .status(200)
                .json({ message: "Yêu cầu kết bạn được chấp nhận", user: chunkData });
        }
        const room = await Rooms.create({ users: listUsers, group: false });
        console.log(sender);

        if (sender.socketId) {
            req.io
                .to(sender.socketId)
                .emit("friend-request-accept-status", { foundUser, room, sender });
            req.io.emit("accept-by-me", { sender, foundUser, room });
        }

        res
            .status(200)
            .json({ message: "Yêu cầu kết bạn được chấp nhận", user: chunkData });
    } catch (error) {
        next(error);
    }
};

//từ chối yêu cầu kết bạn
const declineFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        const currentUser = await User.findById(req.payload.userId);

        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const friendsRequest = await UserRequest.findById(
            req.body.requestId
        ).populate("sender");
        
        console.log(friendsRequest);    
        if (!friendsRequest) {
            return res
                .status(404)
                .json({ error: "Yêu cầu đã bị từ chối hoặc chưa được gửi" });
        }
        if(!(currentUser._id.equals(friendsRequest.sender) || currentUser._id.equals(friendsRequest.receiver))) {
            return res 
                .status(400)
                .json({ error: "Không thể xóa lời mời kết bạn của người khác" });
        }
        await UserRequest.deleteOne({ _id: req.body.requestId });
        console.log(friendsRequest);
        if (friendsRequest.sender.socketId) {
            req.io
                .to(friendsRequest.sender.socketId)
                .emit("friend-request-decline-status", friendsRequest.sender);
        }
        res.status(200).json({ message: "Yêu cầu kết bạn đã bị từ chối" });
    } catch (error) {
        next(error);
    }
};
//lấy người dùng sau khi đăng nhập
const GetUserAfterLogin = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        res.status(200).send({ foundUser });
    } catch (error) {
        next(error);
    }
};
//lấy người dùng theo số điện thoại
const GetUserByPhone = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const { phone } = req.body;
        console.log("Hiện nè:", phone);
        const users = await User.findOne({ phone });
        if (users) {
            return res.status(200).json({ users });
        }
        return res
            .status(403)
            .json({ error: { message: "Số điện thoại đã không tồn tại." } });
    } catch (error) {
        next(error);
    }
};
//lấy người dùng theo tên
const GetUserByName = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const { name } = req.body;
        console.log(name);
        // const users = await User.find({
        //     $text: {
        //         $search: name,
        //     }
        // });
        const users = await User.find({ name: { $regex: name, $options: 'i' } });

        if (users) {
            return res.status(200).json({ users });
        }
        return res
            .status(403)
            .json({ error: { message: "Không tìm thấy người có tên này." } });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
//kiểm tra đã kết bạn chưa
const checkFriend = async (req, res, next) => {
    console.log("Hien ne");
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const userRequest = await User.findOne({
            _id: foundUser._id,
            friends: { $in: [req.params.userID] },
        });
        if (userRequest) {
            return res.status(200).json({ success: true });
        }
        return res.status(200).json({ success: false });
    } catch (err) {
        next(err);
    }
};
//chặn người dùng
const blockFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const userRequest = await User.findOneAndUpdate(
            {
                _id: req.payload.userId,
                friends: { $in: [req.body.friendId] },
            },
            {
                $pull: {
                    friends: { $in: [req.body.friendId] },
                },
            }
        );
        const userRequest1 = await User.findOneAndUpdate(
            {
                _id: req.body.friendId,
                friends: { $in: [req.payload.userId] },
            },
            {
                $pull: {
                    friends: { $in: [req.payload.userId] },
                },
            }
        );
        const Room = await Rooms.findOneAndUpdate(
            {
                users: { $all: [req.payload.userId, req.body.friendId] },
                group: false,
            },
            {
                active: false,
            }
        );
        if (userRequest && Room) {
            return res.status(200).json({ userRequest, Room });
        }
        return res.status(500).json({ error: { message: "Lỗi Không xóa được." } });
    } catch (err) {
        next(err);
    }
};

// const GetFriendByName = async (req, res, next) => {
//     try {
//         const foundUser = await User.findOne({ _id: req.payload.userId });
//         if (!foundUser) {
//             return res
//                 .status(403)
//                 .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
//         }
//         const { name } = req.body;
//         console.log("====================================");
//         console.log(name);
//         const users = await User.find({
//             $text: {
//                 $search: name,
//             },
//             friends: { $in: [foundUser._id] },
//         });
//         if (users) {
//             return res.status(200).json({ users });
//         }
//         return res
//             .status(403)
//             .json({ error: { message: "Không tìm thấy người bạn có tên này." } });
//     } catch (error) {
//         next(error);
//     }
// };
//lấy người dùng theo tên
const GetFriendByName = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res.status(403).json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }

        const { name } = req.body;
        console.log("====================================");
        console.log(name);

        // Tìm tất cả các người dùng có tên gần đúng với `name`
        const users = await User.find({ 
            name: { $regex: new RegExp(name, "i") }, // Sử dụng biểu thức chính quy để tìm kiếm không phân biệt chữ hoa chữ thường
            _id: { $ne: foundUser._id }, // Loại trừ người dùng hiện tại khỏi kết quả
            friends: foundUser._id // Chỉ lấy những người dùng là bạn của người dùng hiện tại
        });

        if (users.length > 0) {
            return res.status(200).json({ users });
        } else {
            return res.status(404).json({ error: { message: "Không tìm thấy người bạn có tên này." } });
        }
    } catch (error) {
        next(error);
    }
};

//lấy người dùng theo số điện thoại
const GetFriendByPhone = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const { phone } = req.body;
        const users = await User.findOne({
            phone: phone,
            friends: { $in: [foundUser._id] },
        });
        if (users) {
            return res.status(200).json({ users });
        }
        return res
            .status(400)
            .json({ error: { message: "Không tìm thấy người bạn có phone này." } });
    } catch (error) {
        next(error);
    }
};
//hủy kết bạn
const deleteFriend = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        const friendUser = await User.findOne({ _id: req.body.friendId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const userRequest = await User.findOneAndUpdate(
            {
                _id: req.payload.userId,
                friends: { $in: [req.body.friendId] },
            },
            {
                $pull: {
                    friends: { $in: [req.body.friendId] },
                },
            }
        );
        const userRequest1 = await User.findOneAndUpdate(
            {
                _id: req.body.friendId,
                friends: { $in: [req.payload.userId] },
            },
            {
                $pull: {
                    friends: { $in: [req.payload.userId] },
                },
            }
        );
        const Room = await Rooms.deleteOne({
            users: {
                $in: [req.payload.userId, new mongoose.Types.ObjectId(req.body.friendId)],
            },
            group: false,
        });
        req.io.to(friendUser.socketId).emit("delete-friend", foundUser);
        req.io.to(foundUser.socketId).emit("delete-friend-by-me", friendUser);
        if (userRequest) {
            return res.status(200).json({ userRequest });
        }
        return res.status(500).json({ error: { message: "Lỗi Không xóa được." } });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    getAllUser,
    newUser,
    getUser,
    updateUser,
    replaceUser,
    deleteUser,
    requestAddFriend,
    cancelSendedFriend,
    acceptFriend,
    declineFriend,
    GetUserAfterLogin,
    GetUserByPhone,
    checkFriend,
    blockFriend,
    GetFriendByName,
    GetFriendByPhone,
    deleteFriend,
    GetUserByName
};
