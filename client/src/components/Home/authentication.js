import Cookies from "js-cookie";
class Authentication {
  constructor() {}

  isAuthencation() {
    const token = Cookies.get("token");
    return token;
  }
}

const authentication = new Authentication();
export { authentication };
