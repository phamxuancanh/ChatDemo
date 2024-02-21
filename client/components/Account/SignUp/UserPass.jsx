import React from "react";
import classes from "./verifyForm.module.scss";
import logo from "../../../assets/logoZoLa.png";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import signupAPI from "../../../api/signupAPI";
const UserPass = (props) => {

  const History = useHistory();

  const [enterName, setEnterName] = useState("");
  const [enterPass, setEnterPass] = useState("");
  const [enterConfirmPass, setEnterConfirmPass] = useState("");
  const [error, setError] = useState("");


  const nameHandler = (event) => {
    setEnterName(event.target.value);
  };
  const passHandler = (event) => {
    setEnterPass(event.target.value);
  };
  const confirmPassHandler = (event) => {
    setEnterConfirmPass(event.target.value);
  };


  

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (enterPass !== enterConfirmPass) {
      setError("Mật Khẩu Không Khớp!")
      return;
    }
    const fetchVerify = async () => {
      try {
        const verify = await signupAPI.signUp({
          name: enterName,
          phone: props.onSendPhoneToUserPass,
          password: enterPass,
        });
        if (verify.status === 201) {
          History.push("/signin");
        }
      } catch (error) {
        //setIsError("mã Code không tồn tại");
        console.log(error);
      }
    };
    fetchVerify();
    
  };

  return (
    <div className={classes.verify}>
      <header>
        <img src={logo} alt="" />
      </header>
      <form onSubmit={formSubmitHandler}>
        <div className={classes["content-form"]}>
          <div className={classes.inputCode}>
            <i class="fas fa-file-signature"></i>
            <input
              type="text"
              placeholder="Tên hiển thị..."
              onChange={nameHandler}
            />
          </div>
          <div className={classes.inputCode}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Mật khẩu"
              onChange={passHandler}
            />
          </div>
          <div className={classes.inputCode}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              onChange={confirmPassHandler}
            />
          </div>
          <span className={classes.error}>{error}</span>
          <button className={classes["btn-first"]}>Xác nhận</button>
        </div>
      </form>
      <footer>
        <Link to="/signup/verify">Quay lại</Link>
      </footer>
    </div>
  );
};

export default UserPass;
