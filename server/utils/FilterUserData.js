module.exports = (user) => {
    return {
        id: user._id,
        username: user.name,
        phone: user.phone,
        avatar: user.avatar,
        active: user.active,
        createdAt: user.createdAt,
        friends: user.friends.map((friend) => ({
            id: friend._id,
            username: friend.username,
        })),
    };
};
