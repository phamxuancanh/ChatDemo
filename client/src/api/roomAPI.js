import axiosClient from "./axiosClient";

const roomAPI = {
  getRoomByUserId(userId) {
    const url = "/rooms/getRoomByUserId/" + userId.userId;
    return axiosClient.get(url, userId);
  },
  getRoomFriend() {
    const url = "/rooms/getRoomFriend/";
    return axiosClient.get(url);
  },
  getRoomAfterLogin() {                         //load list mess
    const url = "/rooms/getRoomAfterLogin/";
    return axiosClient.get(url);
  },
  getRoomGroup() {
    const url = "/rooms/getRoomGroup/";
    return axiosClient.get(url);
  },
  getRoomByNameRoom(name) {
    const url = "/rooms/getRoomByNameRoom/";
    return axiosClient.post(url, name);
  },
  getRoomByNameFriend(name) {
    const url = "/rooms/getRoomByNameFriend/";
    return axiosClient.post(url, name);
  },
};

export default roomAPI;
