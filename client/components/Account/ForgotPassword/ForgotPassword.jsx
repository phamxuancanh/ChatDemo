import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import signupAPI from '@/pages/api/signupAPI';
import Router from 'next/router';
function ForgotPassword(props) {
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
        props.onSendPhoneToPage(enteredPhoneNumber);
        console.log('onSendPhoneToPage has been called with:', enteredPhoneNumber);
        const fetchCheckPhone = async () => {
            try {
                const checkPhone = await signupAPI.checkPhoneAlready({
                    phone: enteredPhoneNumber,
                });
                if (checkPhone.status === 201) {
                    const fetchSendOTP = async () => {
                        const sendOTP = await signupAPI.sendOTP({
                            phone: enteredPhoneNumber,
                        });
                        if (sendOTP.status === 201) {
                            console.log("sendOTP roi");
                            // Router.push("/NewPassword");
                        }
                    };
                    fetchSendOTP();
                }
            } catch (error) {
                setIsError(error.message);
            }
        };
        fetchCheckPhone();
    };

    return (
        <div className="flex  justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6  shadow-xl overflow-hidden">
            <label
                for="helper-text"
                class="block mb-2 text-2xl font-medium text-gray-900 dark:text-white"
            >
                Your phone
            </label>
            <input
                type="phone"
                name="phone"
                id="helper-text"
                aria-describedby="helper-text-explanation"
                class="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your phone number"
                onChange={phoneNumberInputChangeHandler}
            />
            <span className="mb-2 text-lg font-medium text-red-600">{isError.message}</span> <br />
            <button className="w-50 py-2 px-4 bg-green-500 text-black font-semibold rounded-md  items-center justify-center inline-flex"
                onClick={formSubmitHandler}>Lấy lại mật khẩu</button>
            <p
                id="helper-text-explanation"
                class="mt-2 text-lg text-gray-500 dark:text-gray-400"
            >
                We will send otp to your phone. Please check them out
            </p>

            <p className="font-semibold">
                <Link href="/SignIn"> Quay lại</Link>
            </p>

        </div>
    );
}

export default ForgotPassword;
