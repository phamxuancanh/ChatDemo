import axiosClient from "./axiosClient";

const groupAPI = {
  GetFriendByPhone(phoneNumber) {
    const url = "api/users/GetFriendByPhone";
    return axiosClient.post(url, phoneNumber);
  },
  getRoomByUserId(userId) {
    const url = "api/rooms/getRoomByUserId/" + userId.userId;
    return axiosClient.get(url, userId);
  },
  addGroup(NameGroup) {
    const url = "api/rooms/addRoom/";
    return axiosClient.post(url, {
      avatarGroup: NameGroup.avatarGroup,
      NameGroup: NameGroup.NameGroup,
      ListUsers: NameGroup.ListUsers,
    });
  },
  addMember(data) {
    const url = "api/rooms/addMembers/";
    return axiosClient.post(url, { id:data.id._id, list_user_id:data.list_user_id});
  },
  exitGroup(data) {
    const url = "api/rooms/exit/";
    return axiosClient.post(url, {
      id: data.id
    });
  },
  removeMember(data) {
    const url = "api/rooms/removeMember/";
    return axiosClient.post(url, { id: data.id, userWantRemove: data.userWantRemove});
  },
  deleteGroup(id) {
    const url = "api/rooms/" +id.id;
    return axiosClient.delete(url, {RoomID: id.id});
  },
  updateRoom(roomID, data) {
    const url = "api/rooms/" + roomID.roomID;
    return axiosClient.put(url, {name: roomID.data.name, avatar:roomID.data.avatar});
  },
  swapRoomMaster(id) {
    const url = "api/rooms/swapRoomMaster";
    return axiosClient.post(url, {id: id.id, userWantSwap: id.userWantSwap});
  },
};

export default groupAPI;
