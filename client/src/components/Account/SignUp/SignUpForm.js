import React from "react";
import classes from "./SignUpForm.module.scss";
import logo from "../../../assets/logoZoLa.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupAPI from "../../../api/signupAPI";
const SignUpForm = (props) => {
  const navigate = useNavigate();
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const [isError, setIsError] = useState("");

  const phoneNumberInputChangeHandler = (event) => {
    setEnteredPhoneNumber(event.target.value);
    const regex = /^(0|84)[0-9]{9}$/;
    if (regex.test(event.target.value)) {
      setEnteredPhoneNumber(event.target.value);
      setIsError("");
    } else if (event.target.value === "") {
      setIsError("Không được rỗng");
    } else {
      setIsError(
        "Số điện thoại phải bắt đầu bằng 0 hoặc 84 và bao gồm 9 chữ số phía sau!!"
      );
    }
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (enteredPhoneNumber === "") {
      setIsError("Không được rỗng");
      return;
    }
    const regex = /^(0|84)[0-9]{9}$/;
    if (regex.test(enteredPhoneNumber)) {
      setIsError("");
    } else {
      setIsError(
        "Số điện thoại phải bắt đầu bằng 0 hoặc 84 và bao gồm 9 chữ số phía sau!!"
      );
      return;
    }
    props.onSendPhoneToPage(enteredPhoneNumber); //Truyền dữ liệu lên cho sigup pages
    const fetchSignUp = async () => {
      try {
        const signup = await signupAPI.checkPhone({
          phone: enteredPhoneNumber,
        });
        if (signup.status === 201) {
          const fetchSendOTP = async () => {
            const sendOTP = await signupAPI.sendOTP({
              phone: enteredPhoneNumber,
            });
          };
          fetchSendOTP();
          navigate("/signup/verify");
        }
      } catch (error) {
        setIsError(error);
      }
    };

    fetchSignUp();
  };
  return (
    <div className={classes.singup}>
      <header>
        <img src={logo} alt="" />
      </header>
      <form onSubmit={formSubmitHandler}>
        <div className={classes["content-form"]}>
          <div className={classes.inputPhone}>
            <span>
              <i className="fas fa-mobile-alt"></i>
            </span>
            <input
              type="phone"
              placeholder="Số điện thoại"
              onChange={phoneNumberInputChangeHandler}
            />
          </div>
          <span className={classes.error}>{isError}</span> <br />
          <p className={classes.clause}>
            Bằng việc bấm nút đăng ký, bạn đã đồng ý với{" "}
            <span>các điều khoản sử dụng</span>
          </p>
          <button className={classes["btn-first"]}>Đăng ký</button>
        </div>
      </form>
      <footer>
        <p className={classes.signIn}>
          Bạn đã có tài khoản? <Link to="/signin"> Đăng Nhập</Link>
        </p>
      </footer>
    </div>
  );
};

export default SignUpForm;
