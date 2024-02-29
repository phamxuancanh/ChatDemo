import axiosClient from "./axiosClient";

const addFriendAPI = {
  GetUserByPhone(phoneNumber) {
    const url = "api/users/GetUserByPhone";
    return axiosClient.post(url, phoneNumber);
  },

  checkFriend(userID) {
    const url = "api/users/checkFriend/" + userID;
    return axiosClient.get(url);
  },

  checkSendRequest(userID) {
    const url = "api/userRequest/checkSendRequest/" + userID;
    console.log(url);
    return axiosClient.get(url);
  },

  requestAddFriend(id_UserWantAdd) {
    const url = "api/users/requestAddFriend";
    return axiosClient.post(url, id_UserWantAdd);
  },

  getUser(userID) {
    console.log(userID.userID+"api ne`````````````");
    const url = "api/users/" + userID.userID;
    return axiosClient.get(url);
  },

  getListSenderRequest() {
    const url = "api/userRequest/getListReceiver";
    return axiosClient.get(url);
  },

  acceptFriend(requestId) {
    const url = "api/users/acceptFriend";
    return axiosClient.post(url, requestId);
  },

  declineFriend(requestId) {
    const url = "api/users/declineFriend";
    return axiosClient.post(url, requestId);
  },

  getListReceiver() {
    const url = "api/userRequest/getListSenderRequest";
    return axiosClient.get(url);
  },

  cancelSendedFriend(requestId) {
    const url = "api/users/cancelSendedFriend";
    return axiosClient.post(url, requestId);
  },

  deleteFriend(friendId) {
    const url = "api/users/deleteFriend";
    return axiosClient.post(url, {friendId: friendId.friendId});
  },
};

export default addFriendAPI;
