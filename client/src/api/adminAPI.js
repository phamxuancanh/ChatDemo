import axiosClient from "./axiosClient";

const adminAPI = {
    getAllUser() {
        const url = "/users/";
        return axiosClient.get(url);
    },
    addNewUser(newUser) {
        console.log(newUser);
        const url = "/users/";
        return axiosClient.post(url, newUser.newUser);
    },
    GetUserByPhone(phone) {
        const url = "/users/GetUserByPhone";
        return axiosClient.post(url, phone);
    },
    GetUserByName(name) {
        const url = "/users/GetUserByName";
        return axiosClient.post(url, name);
    },
    deleteUser(userId) {
        const url = "/users/" +userId.userId;
        return axiosClient.delete(url);
    },
};

export default adminAPI;