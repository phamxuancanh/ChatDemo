import { Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Admin from "./pages/AdminPage";
import ForgotPassWord from "./pages/ForgotPassWord";
import { Fragment } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import { authentication } from "./components/Home/authentication";
//import {SocketContext, socket} from './context/socket';
//import axios from "./utils/axios";
//import { useHistory } from "react-router-dom";

function App(ctx) {
  return (
    <Fragment>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />{" "}
        </Route>
        {/* <SocketContext.Provider value={socket}>  */}
        <PrivateRouter path="/home" component={HomePage}></PrivateRouter>
        {/* </SocketContext.Provider>  */}
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/forgotpassword">
          <ForgotPassWord />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Fragment>
  );
}

function PrivateRouter({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authentication.isAuthencation() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
}

export default App;
