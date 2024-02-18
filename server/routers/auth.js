const AuthController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
//const router = require("express-promise-router")();
const { verifyAccessToken } = require("../helpers/jwt_service");

const {
    validateBody,
    validateParam,
    schemas,
} = require("../helpers/user_validate");
//OK !!
router
    .route("/signup")
    .post(validateBody(schemas.authSignUpSchema), AuthController.signUp);

//OK !!
router
    .route("/signin")
    .post(validateBody(schemas.authSignInSchema), AuthController.signIn);

router
    .route("/changePassword")
    .post(
        validateBody(schemas.authChangePasswordSchema),
        verifyAccessToken,
        AuthController.ChangePassword
    );
// OK !!
router.route("/refreshToken").post(AuthController.refreshToken);
//OK 
router.route("/logout").post(AuthController.Logout);
//OK
router.route("/sendOtp").post(AuthController.sendOTP);
//OK
router.route("/verifyOtpSignUp").post(AuthController.verifyOTPSignUp);
//ok
router.route("/forgotPassword").post(AuthController.forgotPassword);
//ok
router.route("/checkPhone").post(AuthController.checkPhone);
//ok
router.route("/checkPhoneAlready").post(AuthController.checkPhoneAlready);

module.exports = router;
