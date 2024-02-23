import axios from "axios";
import Cookies from "js-cookie";
//let token = localStorage.getItem("token");
const axiosClient = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    //authorization: `${token}`,
  },
});

axiosClient.refreshToken = async () => {
  const refreshToken = Cookies.get("refreshToken");
  return (
    await axiosClient.post("api/auths/refreshToken", { refreshToken: refreshToken })
  ).data;
};

axiosClient.setLocalAccessToken = async (accessToken, refToken) => {
  console.log("hihihihihiih");
  console.log(accessToken);
  Cookies.set("token", accessToken);
  Cookies.set("refreshToken", refToken);
};

axiosClient.interceptors.request.use(
  function (config) {
    config.headers.authorization = Cookies.get("token");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  async function (reponse) {
    return reponse;
  },
  async function (error) {
    // console.log("ERROR REPONSE: ", error.response);
    const { config, status, data } = error.response;
    if (config.url === "api/auths/checkPhone" && status === 403) {
      const error = data.error;
      const message = error.message;
      return Promise.reject(message);
    }
    if (config.url === "api/auths/verifyOtpSignUp" && status === 400) {
      const error = data.error;
      console.log(error);
      const message = error.message;
      return Promise.reject(message);
    }
    if (config.url === "api/auths/signin" && status === 403) {
      const error = data.error;
      return Promise.reject(error);
    }
    if (config.url === "api/users/GetUserByPhone" && status === 403) {
      const error = data.error.message;
      return Promise.reject(error);
    }
    if (
      (config.url === "api/auths/ChangePassword" && status === 403) ||
      status === 400
    ) {
      const error = data.error?.message;
      return Promise.reject(error);
    }
    if (status === 401) {
      if (data.error.message === "jwt expired") {
        console.log("trường hợp Token hết hạn");

        const { accessToken, refToken } = await axiosClient.refreshToken();
        console.log(accessToken + "LINE" + refToken);
        if (accessToken) {
          console.log("đã lấy lại accessToken thành công");
          config.headers["authorization"] = accessToken;

          await axiosClient.setLocalAccessToken(accessToken, refToken);

          return axiosClient(config);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
