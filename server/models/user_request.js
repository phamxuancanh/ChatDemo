const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRequestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserRequest = mongoose.model("UserRequest", UserRequestSchema);
module.exports = UserRequest;
