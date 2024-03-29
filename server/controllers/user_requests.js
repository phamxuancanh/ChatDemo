const User = require("../models/users");
const UserRequest = require("../models/user_requests");
const FilterUserData = require("../utils/FilterUserData");
//lấy danh sách yêu cầu kết bạn
const getListSenderRequest = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const userRequest = await UserRequest.find({
            sender: foundUser._id,
        });
        res.status(200).json(userRequest);
    } catch (err) {
        next(err)
    }
}
//lấy danh sách người gửi yêu cầu kết bạn
const getListReceiver = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const userRequest = await UserRequest.find({
            receiver: foundUser._id,
        });
        res.status(200).json(userRequest);
    } catch (err) {
        next(err)
    }
}
//kiểm tra đã gửi yêu cầu kết bạn chưa
const checkSendRequest = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser) {
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        }
        const userRequest = await UserRequest.findOne({
            sender: foundUser._id,
            receiver: req.params.userID,
        });
        if (userRequest) {
            return res.status(200).json({ success: true });
        }
        return res.status(200).json({ success: false });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getListSenderRequest,
    getListReceiver,
    checkSendRequest
}