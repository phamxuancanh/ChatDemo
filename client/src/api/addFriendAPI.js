import axiosClient from "./axiosClient";

const addFriendAPI = {
  GetUserByPhone(phoneNumber) {
    const url = "/users/GetUserByPhone";
    return axiosClient.post(url, phoneNumber);
  },

  checkFriend(userID) {
    const url = "/users/checkFriend/" + userID;
    return axiosClient.get(url);
  },

  checkSendRequest(userID) {
    const url = "/userRequest/checkSendRequest/" + userID;
    console.log(url);
    return axiosClient.get(url);
  },

  requestAddFriend(id_UserWantAdd) {
    const url = "/users/requestAddFriend";
    return axiosClient.post(url, id_UserWantAdd);
  },

  getUser(userID) {
    const url = "/users/" + userID.userID;
    return axiosClient.get(url);
  },

  getListSenderRequest() {
    const url = "/userRequest/getListReceiver";
    return axiosClient.get(url);
  },

  acceptFriend(requestId) {
    const url = "/users/acceptFriend";
    return axiosClient.post(url, requestId);
  },

  declineFriend(requestId) {
    const url = "/users/declineFriend";
    return axiosClient.post(url, requestId);
  },

  getListReceiver() {
    const url = "/userRequest/getListSenderRequest";
    return axiosClient.get(url);
  },

  cancelSendedFriend(requestId) {
    const url = "/users/cancelSendedFriend";
    return axiosClient.post(url, requestId);
  },

  deleteFriend(friendId) {
    const url = "/users/deleteFriend";
    return axiosClient.post(url, {friendId: friendId.friendId});
  },
};

export default addFriendAPI;
