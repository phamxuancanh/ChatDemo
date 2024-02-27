import axiosClient from "./axiosClient";

const roomAPI = {
  getRoomByUserId(userId) {
    const url = "api/chatrooms/getRoomByUserId/" + userId.userId;
    return axiosClient.get(url, userId);
  },
  getRoomFriend() {
    const url = "api/chatrooms/getRoomFriend/";
    return axiosClient.get(url);
  },
  getRoomAfterLogin() {                         //load list mess
    const url = "api/chatrooms/getRoomAfterLogin/";
    return axiosClient.get(url);
  },
  getRoomGroup() {
    const url = "api/chatrooms/getRoomGroup/";
    return axiosClient.get(url);
  },
  getRoomByNameRoom(name) {
    const url = "api/chatrooms/getRoomByNameRoom/";
    return axiosClient.post(url, name);
  },
  getRoomByNameFriend(name) {
    const url = "api/chatrooms/getRoomByNameFriend/";
    return axiosClient.post(url, name);
  },
};

export default roomAPI;
