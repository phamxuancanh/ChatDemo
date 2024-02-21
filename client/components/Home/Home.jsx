import React from "react";
import { useRouter } from 'next/router';
import { useState } from "react";
import logoutAPI from "../../pages/api/logoutAPI";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
const Home = (props) => {
  const router = useRouter();
  const loggedInUser = useSelector((state) => state.user.current);


  const LogOutHandler = async (event) => {
    event.preventDefault();

    console.log(Cookies.get("refreshToken"));

    const fetchLogOut = async () => {
      try {
        const logOut = await logoutAPI.logout({
          refreshToken: Cookies.get("refreshToken"),
        });

        if (logOut.status === 200) {
          Cookies.remove("refreshToken");
          Cookies.remove("token");
          localStorage.removeItem("user");
          router.push("/SignIn");
        }
      } catch (error) {
        console.log(error);
        console.log("fail");
      }
    };

    fetchLogOut();
  };

  return (
    <div className="">
      WELCOME TO MY WEBSITE, {loggedInUser ? loggedInUser.name : 'Guest'}
      <br/>
      <button onClick={LogOutHandler}>Logout</button>
    </div>
  );
};

export default Home;
