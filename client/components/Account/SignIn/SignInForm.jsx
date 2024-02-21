import React from "react";
import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { signin } from "../../Home/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from 'classnames';
 
const SignInForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [enteredPhone, setEnteredPhone] = useState("");
  const [enteredPass, setEnteredPass] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [passIsValid, setPassIsValid] = useState(false);
  const [isError, setIsError] = useState("");
  const buttonLogin = classNames(
    'mt-7 w-full flex justify-center items-center p-3 gap-7 rounded-lg mr-7 hover:bg-lime-700',
    {
      'bg-red-500': !(phoneIsValid && passIsValid),
      'bg-lime-500 text-white font-bold cursor-pointer': phoneIsValid && passIsValid,
    }
  );
  const phoneHandler = (event) => {
    const patte = /^(0|84)[0-9]{9}$/;
    if (patte.test(event.target.value)) {
      setEnteredPhone(event.target.value);
      setPhoneIsValid(true);
      setIsError("");
    } else if (event.target.value === "") {
      setIsError("Không được rỗng");
    } else {
      setIsError(
        "Số điện thoại phải bắt đầu bằng 0 hoặc 84 và bao gồm 9 chữ số phía sau!!"
      );
      setPhoneIsValid(false);
    }
  };

  const passHandler = (event) => {
    const patte = /[a-zA-Z0-9]{6,}$/;
    if (patte.test(event.target.value)) {
      setEnteredPass(event.target.value);
      setPassIsValid(true);
    } else {
      setPassIsValid(false);
    }
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    if (enteredPhone.trim() === "" || enteredPass.trim() === "") {
      return;
    }

    try {
      const action = signin({
        phone: enteredPhone,
        password: enteredPass,
      });

      const resultAction = await dispatch(action);
      const user = unwrapResult(resultAction);

 
      router.push("/HomePage");
      
      //console.log(user);
    } catch (error) {
      setIsError(error.message);
    }
  };

  return (
    <div className='h-screen bg-black'>
      <div className="flex justify-center items-center bg-panel-header-background  h-screen w-screen flex-col gap-6  shadow-xl overflow-hidden">
        <div className="flex justify-center items-center gap-2 text-white">
          <Image src="/humpback-whale-swimming-with-remora-on-top-9foqv8jim0ziu9ql.jpg" height={300} width={300} className="rounded-full"></Image>
          <span className="text-7xl font-semibold p-20">JWT Demo</span>
        </div>
        <p className="text-ascent-1 text-3xl font-semibold text-white">
          Log in to your account
        </p>
        <form className="w-1/3 h-fit items-center justify-center">
          <div class="mb-6">
            <label
              for="phone"
              class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
            >
              Phone
            </label>
            <input
              type="phone"
              id="phone"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="phone number"
              required
              onChange={phoneHandler}
            />
          </div>
          <div class="mb-6 items-center">
            <label
              for="password"
              class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4 "
              placeholder="•••••••••"
              required
              onChange={passHandler}
            />
            <span className="error text-red-600 font-semibold">{isError}</span> <br />

          </div>
          <Link href="/ForgotPassword">
            <p className="text-lg text-right text-blue-400 hover:text-blue-700">Forgot Password ?</p>
          </Link>
          <Link href="">
            <button className={buttonLogin}
              onClick={formSubmissionHandler}>
              <span className=" text-white text-2xl">Login</span>
            </button>
          </Link>
        </form>

        <p className="text-white text-lg text-center">
          Don't have an account?
          <Link
            href="/SignUp"
            className="text-blue-400 font-semibold ml-2 cursor-pointer hover:text-blue-700"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
