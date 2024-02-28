import axiosClient from "./axiosClient";

const groupAPI = {
  GetFriendByPhone(phoneNumber) {
    const url = "api/users/GetFriendByPhone";
    return axiosClient.post(url, phoneNumber);
  },
  getRoomByUserId(userId) {
    const url = "api/chatrooms/getRoomByUserId/" + userId.userId;
    return axiosClient.get(url, userId);
  },
  addGroup(NameGroup) {
    const url = "api/chatrooms/addRoom/";
    return axiosClient.post(url, {
      avatarGroup: NameGroup.avatarGroup,
      NameGroup: NameGroup.NameGroup,
      ListUsers: NameGroup.ListUsers,
    });
  },
  addMember(data) {
    const url = "api/chatrooms/addMembers/";
    return axiosClient.post(url, { id:data.id._id, list_user_id:data.list_user_id});
  },
  exitGroup(data) {
    const url = "api/chatrooms/exit/";
    return axiosClient.post(url, {
      id: data.id
    });
  },
  removeMember(data) {
    const url = "api/chatrooms/removeMember/";
    return axiosClient.post(url, { id: data.id, userWantRemove: data.userWantRemove});
  },
  deleteGroup(id) {
    const url = "api/chatrooms/" +id.id;
    return axiosClient.delete(url, {RoomID: id.id});
  },
  updateRoom(roomID, data) {
    const url = "api/chatrooms/" + roomID.roomID;
    return axiosClient.put(url, {name: roomID.data.name, avatar:roomID.data.avatar});
  },
  swapRoomMaster(id) {
    const url = "api/chatrooms/swapRoomMaster";
    return axiosClient.post(url, {id: id.id, userWantSwap: id.userWantSwap});
  },
};

export default groupAPI;
