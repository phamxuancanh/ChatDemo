const User = require("./models/users");
const Room = require("./models/chatrooms");
const { ObjectId } = require("mongodb");

module.exports = async (io) => {
    await io.on("connection", (socket) => {
        if (io.req) {
            console.log("cHUA DANG NHAP");
            if (io.req.payload) {
                console.log(io.req.payload.userId + "CANH");
                const userIdLogin = io.req.payload.userId;
                addSocketIdInDB(socket.id, userIdLogin);
                console.log(socket.id);
                let rooms = getAllRoomById(userIdLogin);

                rooms.then(function (result) {
                    //console.log(result) // "Rooms here"
                    for (let i = 0; i < result.length; i++) {
                        const idRoom = result[i]._id.toString();
                        socket.join(idRoom);
                    }
                    console.log(socket.adapter.rooms);
                });

                socket.on("callUser", (data) => {
                    console.log("calling socketjs dong 25: " + data.userToCall);
                    setTimeout(() => {
                        io.to(data.userToCall).emit("callUser", {
                            signal: data.signalData,
                            from: data.from,
                            name: data.name,
                            avatar: data.avatar,
                        });
                    }, 4000);
                });

                socket.on("answerCall", (data) => {
                    socket.broadcast.emit("updateUserMedia", {
                        type: data.type,
                        currentMediaStatus: data.myMediaStatus,
                    });
                    io.to(data.to).emit("callAccepted", data.signal);
                    console.log("DONG 34 DA ACCEPT");
                });

                socket.on("callVideoToUser", (data) => {
                    console.log(
                        "abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc"
                    );
                    io.to(data.socketId).emit("abc", data); //Phát tới người có socket
                });

                socket.on("answerHome", () => {
                    console.log("da accept answerhome");
                });

                socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
                    socket.broadcast.emit("updateUserMedia", {
                        type,
                        currentMediaStatus,
                    });
                });

                socket.on("join-room-after-acceptFriend", (data) => {
                    socket.join(data.room._id);
                });
                socket.on("join-room-after-accept-by-me", (data) => {
                    socket.join(data.room._id);
                });
                socket.on("join-room-socket", (data) => {
                    socket.join(data._id);
                    console.log(socket.adapter.rooms);
                });

                socket.on("disconnect", () => {
                    console.log("disconnect !!!!" + userIdLogin);
                    socket.broadcast.emit("callEnded"); //Phát tới ch
                    removeSocketIdInDB(userIdLogin);
                });
            }
        }
    });
};

async function addSocketIdInDB(socket_id, user_id) {
    const user = await User.findById(user_id);
    if (socket_id) {
        user.socketId = socket_id;
    }
    await user.save();
}
async function removeSocketIdInDB(user_id) {
    const user = await User.findById(user_id);
    user.socketId = "";
    await user.save();
}

async function getAllRoomById(user_id) {
    const _id = new ObjectId(user_id);
    const rooms = await Room.find({
        users: { $in: [_id] },
    });
    return rooms;
}
