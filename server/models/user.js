const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    phone: {
      type: String,
      min: 3,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
      default:
        "https://media.istockphoto.com/vectors/man-face-icon-in-medical-mask-male-person-in-surgical-mask-people-vector-id1222731059",
    },
    role: {
      type: String,
      default: "user",
    },
    active: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: "",
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    birthday: {
      type: Date,
    },
    gender: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
const User = mongoose.model("User", UserSchema);
User.createIndexes();
module.exports = User;
