import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Admin from "./pages/AdminPage";
import ForgotPassWord from "./pages/ForgotPassWord";
import { Fragment } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import { authentication } from "./components/Home/authentication";

function App(ctx) {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <PrivateRoute path="/home" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forgotpassword" element={<ForgotPassWord />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  );
}

function PrivateRoute({ element: Component, ...rest }) {
  return authentication.isAuthencation() ? (
    <Route {...rest} element={Component} />
  ) : (
    <Navigate to="/signin" replace />
  );
}

export default App;