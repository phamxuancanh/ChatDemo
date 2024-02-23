import axiosClient from "./axiosClient";

const adminAPI = {
    getAllUser() {
        const url = "api/users/";
        return axiosClient.get(url);
    },
    addNewUser(newUser) {
        console.log(newUser);
        const url = "api/users/";
        return axiosClient.post(url, newUser.newUser);
    },
    GetUserByPhone(phone) {
        const url = "api/users/GetUserByPhone";
        return axiosClient.post(url, phone);
    },
    GetUserByName(name) {
        const url = "api/users/GetUserByName";
        return axiosClient.post(url, name);
    },
    deleteUser(userId) {
        const url = "api/users/" +userId.userId;
        return axiosClient.delete(url);
    },
};

export default adminAPI;