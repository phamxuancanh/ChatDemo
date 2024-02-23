import { Routes, Route } from "react-router-dom";
import { Fragment, useState } from "react";
import SignUpForm from "../components/Account/SignUp/SignUpForm";


const SignUp = (props) => {
  const [valuePhone, setValuePhone] = useState("");

  const receivePhoneHandler = (phone) => {
    setValuePhone(phone);
  };

  return (
    // <Routes>
    //   <Route path="/signup" element={<SignUpForm onSendPhoneToPage={receivePhoneHandler} />} />
    //   {/* <Route path="/signup/verify" element={<VerifyForm valuePhone={valuePhone} />} />
    //   <Route path="/signup/userpass" element={<UserPass valuePhone={valuePhone} />} /> */}
    // </Routes>
    <SignUpForm onSendPhoneToPage={receivePhoneHandler} />
  );
};

export default SignUp;
