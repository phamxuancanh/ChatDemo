import axiosClient from "./axiosClient";

const messageAPI = {
  GetMessage(message) {
    const url = "/messages/" + message.idRoom;
    return axiosClient.get(url);
  },
  AddMessage(message) {
    const url = "/messages/addMessage";
    return axiosClient.post(url, message.message);
  },
  CallVideo(roomId) {
    const url = "/messages/callVideo";
    return axiosClient.post(url, { RoomId: roomId.idRoom });
  },
  cancelMessage(messageId) {
    const url = "/messages/cancelMessage/" + messageId.messageId;
    return axiosClient.put(url);
  },
  readMessage(messageId) {
    const url = "/messages/readMessage/" + messageId.messageId;
    return axiosClient.put(url);
  },
  getNewMessage() {
    const url = "/messages/getNewMessage/a";
    return axiosClient.get(url);
  },
};

export default messageAPI;
