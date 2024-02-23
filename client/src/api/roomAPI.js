import axiosClient from "./axiosClient";

const roomAPI = {
  getRoomByUserId(userId) {
    const url = "api/rooms/getRoomByUserId/" + userId.userId;
    return axiosClient.get(url, userId);
  },
  getRoomFriend() {
    const url = "api/rooms/getRoomFriend/";
    return axiosClient.get(url);
  },
  getRoomAfterLogin() {                         //load list mess
    const url = "api/rooms/getRoomAfterLogin/";
    return axiosClient.get(url);
  },
  getRoomGroup() {
    const url = "api/rooms/getRoomGroup/";
    return axiosClient.get(url);
  },
  getRoomByNameRoom(name) {
    const url = "api/rooms/getRoomByNameRoom/";
    return axiosClient.post(url, name);
  },
  getRoomByNameFriend(name) {
    const url = "api/rooms/getRoomByNameFriend/";
    return axiosClient.post(url, name);
  },
};

export default roomAPI;
