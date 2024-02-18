const bcrypt = require("bcryptjs");
const User = require("../models/users");
const client = require("../helpers/connect_redis");
const { sendSmsOTP, verifyOtp } = require("../services/phone_service");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../helpers/jwt_service");
const signIn = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) {
            return res
                .status(403)
                .json({ error: { message: "Tài khoản chưa được đăng ký." } });
        }
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
            return res
                .status(403)
                .json({ error: { message: "Tài khoản hoặc mật khẩu không khớp !!!" } });
        }
        user.active = true;
        await user.save();
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);
        res.setHeader("authorization", accessToken);
        res.setHeader("refreshToken", refreshToken);

        return res
            .status(200)
            .json({ success: true, accessToken, refreshToken, user });
    } catch (error) {
        next(error);
    }
    // Assign a token
};
const signUp = async (req, res, next) => {
    try {
        const { name, phone, password } = req.value.body;
        // Check if there is a user with the same user
        const foundUser = await User.findOne({ phone });
        if (foundUser)
            return res
                .status(403)
                .json({ error: { message: "Số điện thoại đã được sử dụng." } });
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(password, salt);
        // Re-assign password hashed
        const newPassword = passwordHashed;
        // Create a new user
        const newUser = await User.create({
            name,
            phone,
            password: newPassword,
        });
        return res.status(201).json({ success: true, newUser });
    } catch (error) {
        next(error);
    }
};
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(403).json({ message: "k co refresh token" });
        }
        console.log(refreshToken);
        const { userId } = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        return res.status(200).json({ accessToken, refToken });
    } catch (error) {
        next(error);
    }
};
const Logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        // console.log(req.headers);
        if (!refreshToken) {
            return res.status(403).json({ message: "k co refresh token" });
        }
        const { userId } = await verifyRefreshToken(refreshToken);
        const user = await User.findById(userId);
        user.active = false;
        await user.save();
        client.del(userId.toString(), (err, reply) => {
            if (err) return res.status(500).json({ message: "Lỗi không xác định" });
            return res.status(200).json({ message: "Đăng xuất thành công !!!!" });
        });
    } catch (error) {
        next(error);
    }
};
const ChangePassword = async (req, res, next) => {
    try {
        const { password, reEnterPassword, newPassword } = req.body;
        console.log(req.payload);
        // Check if there is a user with the same user
        const foundUser = await User.findOne({ _id: req.payload.userId });
        if (!foundUser)
            return res
                .status(403)
                .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
        //Check password co ton tai khong
        const isValid = await foundUser.isValidPassword(password);
        if (!isValid) {
            return res
                .status(403)
                .json({ error: { message: "Password Không Đúng " } });
        }
        //Check password co giong khong
        if (password !== reEnterPassword) {
            return res
                .status(403)
                .json({ error: { message: "Password Nhập Sai!!!" } });
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(newPassword, salt);
        // Re-assign password hashed
        const newChangePassword = passwordHashed;
        //Change Password
        foundUser.password = newChangePassword;
        await foundUser.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
const forgotPassword = async (req, res, next) => {
    try {
        const { phone, code, Password, reEnterPassword } = req.body;
        if (Password !== reEnterPassword) {
            return res
                .status(403)
                .send([{ message: "Password and reEnterpassword Không giống nhau " }]);
        }
        const result = await verifyOtp(phone, code);
        if (result) {
            const FoundUser = await User.findOne({ phone });
            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            // Generate a password hash (salt + hash)
            const passwordHashed = await bcrypt.hash(Password, salt);
            // Re-assign password hashed
            const newChangePassword = passwordHashed;
            //Change Password
            FoundUser.password = newChangePassword;
            await FoundUser.save();
            res
                .status(200)
                .send([{ message: "Password đã được cập nhật ", FoundUser }]);
        } else {
            res.status(400).send([
                {
                    msg: "Code is used or expired",
                    param: "otp",
                },
            ]);
        }
    } catch (error) {
        next(error);
    }
};
const sendOTP = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const result = await sendSmsOTP(phone);
        if (result !== true) {
            res.status(500).json([
                {
                    msg: "Send SMS Failed",
                    param: "sms",
                },
            ]);
        } else {
            res.status(201).json({
                message: "Send SMS successfully",
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
const verifyOTPSignUp = async (req, res, next) => {
    try {
        const { phone, code } = req.body;
        const result = await verifyOtp(phone, code);
        console.log(result);
        if (result) {
            res.status(200).send("Check code successfully");
        } else {
            res.status(400).send([
                {
                    msg: "Code is used or expired",
                    param: "otp",
                },
            ]);
        }
    } catch (error) {
        next(error);
    }
};
//chua tồn tại thì true
const checkPhone = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const foundPhone = await User.findOne({ phone });
        if (foundPhone)
            return res
                .status(403)
                .json({ error: { message: "Số điện thoại đã được sử dụng." } });
        return res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
};

//có tồn tại thì true
const checkPhoneAlready = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const foundPhone = await User.findOne({ phone });
        if (foundPhone) return res.status(201).json({ success: true });
        return res
            .status(403)
            .json({ error: { message: "Số điện thoại này chưa được sử dụng." } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signIn,
    signUp,
    refreshToken,
    Logout,
    ChangePassword,
    forgotPassword,
    sendOTP,
    verifyOTPSignUp,
    checkPhone,
    checkPhoneAlready,
};
