import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import { Fragment } from "react";
import { authentication } from "./components/Home/authentication";

function App(ctx) {
  return (
    <Fragment>
        <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<PrivateRoute />} />
          {/* <Route path="/admin" element={<Admin />} />
          <Route path="/forgotpassword" element={<ForgotPassWord />} />
          <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    </Fragment >


  );
}

function PrivateRoute() {
  console.log(authentication.isAuthencation());
  return authentication.isAuthencation() ? <HomePage /> : <Navigate to="/signin" />;
}

export default App;