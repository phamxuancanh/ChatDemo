import axiosClient from "./axiosClient";

const signinAPI = {
    signIn(phoneNumber, password) {
    const url = "api/auths/signin";
    return axiosClient.post(url, phoneNumber, password);
  }

};

export default signinAPI;
