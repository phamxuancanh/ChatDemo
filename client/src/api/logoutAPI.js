import axiosClient from "./axiosClient";

const logoutAPI = {
    logout(refreshtoken) {
        // console.log(refreshtoken.refreshToken);
    const url = "/auth/logout";
    return axiosClient.post(url, {refreshToken: refreshtoken.refreshToken});
  }
};

export default logoutAPI;
