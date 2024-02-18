const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = Schema(
  {
    name: String,
    users: Array,
    group: Boolean,
    avatar:String,
    active:{
      type: Boolean,
      default: true,
    },
    roomMaster:{
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

const Rooms = mongoose.model("Rooms", RoomSchema);
module.exports = Rooms;
