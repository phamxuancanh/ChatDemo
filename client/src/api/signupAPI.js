import axiosClient from "./axiosClient";

const signupAPI = {
  checkPhone(phoneNumber) {
    const url = "api/auths/checkPhone";
    return axiosClient.post(url, phoneNumber);
  },
  checkPhoneAlready(phoneNumber) {
    const url = "api/auths/checkPhoneAlready";
    return axiosClient.post(url, phoneNumber);
  },
  signUp(data) {
    const url = "api/auths/signup";
    return axiosClient.post(url, data);
  },
  sendOTP(phoneNumber) {
    const url = "api/auths/sendOtp";
    return axiosClient.post(url, phoneNumber);
  },
  verifyOTPSignUp(phoneNumber, code) {
    const url = "api/auths/verifyOTPSignUp";
    return axiosClient.post(url, phoneNumber,code);
  },
  forgotPassword(phoneNumber) {
    const url = "api/auths/forgotPassword";
    return axiosClient.post(url, phoneNumber);
  },
};

export default signupAPI;
