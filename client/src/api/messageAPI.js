import axiosClient from "./axiosClient";

const messageAPI = {
  GetMessage(message) {
    const url = "api/messages/" + message.idRoom;
    return axiosClient.get(url);
  },
  AddMessage(message) {
    const url = "api/messages/addMessage";
    return axiosClient.post(url, message.message);
  },
  CallVideo(roomId) {
    const url = "api/messages/callVideo";
    return axiosClient.post(url, { RoomId: roomId.idRoom });
  },
  cancelMessage(messageId) {
    const url = "api/messages/cancelMessage/" + messageId.messageId;
    return axiosClient.put(url);
  },
  readMessage(messageId) {
    const url = "api/messages/readMessage/" + messageId.messageId;
    return axiosClient.put(url);
  },
  getNewMessage() {
    const url = "api/messages/getNewMessage/a";
    return axiosClient.get(url);
  },
};

export default messageAPI;
