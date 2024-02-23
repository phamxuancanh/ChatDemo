import axiosClient from "./axiosClient";

const userAPI = {
  replaceUser(userID) {
    localStorage.setItem("user", JSON.stringify(userID.newUser));
    const url = "api/users/" + userID.userID;
    return axiosClient.put(url, userID.newUser);
  },

  GetFriendByName(data) {
    const url = "api/users/GetFriendByName";
    return axiosClient.post(url,{name: data.name});
  },
  ChangePassword(data) {
    const url = "api/auths/ChangePassword";
    return axiosClient.post(url,{password: data.password,reEnterPassword: data.reEnterPassword,newPassword: data.newPassword,});
  },
};

export default userAPI;
