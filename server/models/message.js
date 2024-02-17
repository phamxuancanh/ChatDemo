const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    RoomId: {
      type: String,
    },
    text: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    readMessage: {
      type: Boolean,
      default: false, //false Chưa xem
    },
    type: String,
    
    nameFile: String
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
