import axiosClient from "./axiosClient";

const logoutAPI = {
    logout(refreshtoken) {
    const url = "api/auths/logout";
    return axiosClient.post(url, {refreshToken: refreshtoken.refreshToken});
  }
};

export default logoutAPI;
