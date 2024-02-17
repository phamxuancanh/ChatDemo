const { config } = require("dotenv");

require("dotenv").config();
const accountSid = process.env.ACOUNTSID_TWILIO;
const authToken = process.env.TOKEN_TWILIO;
const serviceId = process.env.SERVICESID_TWILIO;
const client = require("twilio")(accountSid, authToken);
/**
 * method to send smst verify otp
 * @param {*} req
 * @param {*} res
 * @param phone
 * @param messageSuccess
 */
const sendSmsOTP = async (phone) => {
    try {
        const verification = await client.verify
            .services(serviceId)
            .verifications.create({ to: `+84${phone}`, channel: "sms" });
        if (verification) return true;
        else return false;
    } catch (error) {
        return false;
    }
    return true;
};

const verifyOtp = async (phone, code) => {
    try {
        // eslint-disable-next-line camelcase
        const verification_check = await client.verify
            .services(serviceId)
            .verificationChecks.create({ to: `+84${phone}`, code: code });

        console.log(verification_check);
        if (verification_check.valid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};
module.exports = {
    sendSmsOTP: sendSmsOTP,
    verifyOtp: verifyOtp,
};
