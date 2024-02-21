import logo from "../../../public/humpback-whale-swimming-with-remora-on-top-9foqv8jim0ziu9ql.jpg";
import React, { useState, useRef } from "react";
import signupAPI from "@/pages/api/signupAPI";
import Router from "next/router";
import Link from "next/link";
import { useToasts } from 'react-toast-notifications';

const NewPassword = (props) => {
    const { addToast } = useToasts();
    const inputRefs = useRef([...Array(6)].map(() => React.createRef()));
    const [enteredNewPass, setEnteredNewPass] = useState("");
    const [enteredReNewPass, setEnteredReNewPass] = useState("");

    const [isDisabled, setIsDisabled] = useState(false);
    const [enteredCode, setEnteredCode] = useState(["", "", "", "", "", ""]);
    // const handleInputChange = (index, value) => {
    //     const newEnteredCode = [...enteredCode];
    //     newEnteredCode[index] = value;
    //     setEnteredCode(enteredCode);
    //     console.log("enteredCode", enteredCode);
    //     // Focus on the next input box
    //     if (index < inputRefs.current.length - 1 && value !== "") {
    //         inputRefs.current[index + 1].current.focus();
    //     }

    // };
    const handleInputChange = (index, value) => {
        const newEnteredCode = [...enteredCode];
        newEnteredCode[index] = value;
        setEnteredCode(newEnteredCode);
        console.log("enteredCode", newEnteredCode); // Ghi nhật ký của mảng mới đã được cập nhật
    
        // Focus on the next input box
        if (index < inputRefs.current.length - 1 && value !== "") {
            inputRefs.current[index + 1].current.focus();
        }
    };

    const NewPassWordHandler = (event) => {
        setEnteredNewPass(event.target.value)
    }
    const ReNewPassWordHandler = (event) => {
        setEnteredReNewPass(event.target.value)
    }



    const formSubmitHandler = (event) => {
        console.log("phoneNEWPASSWORD COMPONENTS" + props.onSendPhoneToVerify);
        event.preventDefault();
        const forgotPassWord = async () => {
            try {
                console.log("enteredCode", enteredCode.join(""));
                const newPassWord = await signupAPI.forgotPassword({
                    phone: props.onSendPhoneToVerify,
                    code: enteredCode.join(""),
                    Password: enteredNewPass,
                    reEnterPassword: enteredReNewPass
                });
                if (newPassWord.status === 200) {
                    addToast('change password successfully', { appearance: 'success', autoDismiss: true, position: 'top-right' });
                    Router.push("/SignIn");
                }
            } catch (error) {
                console.log(error);
            }
        };
        forgotPassWord();
    };

    const SendOTPAgainHandler = () => {
        const fetchSendOTP = async () => {
            const sendOTP = await signupAPI.sendOTP({
                phone: props.onSendPhoneToVerify,
            });
            if (sendOTP.status === 201) {
                addToast('Đã gửi lại OTP thành công', { appearance: 'success', autoDismiss: true, position: 'top-right' });
            }
        };
        fetchSendOTP();
    }
    return (
        <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6 shadow-xl overflow-hidden">
            <p className="text-white text-3xl mb-12 font-semibold">
                Please enter the OTP you received in the phone
            </p>

            <div className="w-1/3 flex justify-center items-center">
                {enteredCode.map((value, index) => (
                    <input
                        disabled={isDisabled}
                        key={index}
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        id="helper-text"
                        maxLength="1"
                        ref={inputRefs.current[index]}
                        className="bg-gray-50 border mr-5 w-1/12 border-gray-300 text-gray-900 text-2xl rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                ))}
            </div>
            <p>{enteredCode.join("")}</p>
            <p className="underline font-semibold text-blue-600 cursor-pointer mt-2" onClick={SendOTPAgainHandler}>Gửi lại mã kích hoạt</p>

            <div className={`w-1/3 flex justify-center items-center`}>
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-1/2"
                >
                    Enter your new password
                </label>

                <input
                    type="password"
                    id="newpassword"
                    name="newpassword"
                    onChange={NewPassWordHandler}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="•••••••••"
                    required
                />
            </div>
            <div className={`w-1/3 flex justify-center items-center`}>
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-1/2"
                >
                    Enter your confirm password
                </label>

                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={ReNewPassWordHandler}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="•••••••••"
                    required
                />
            </div>
            <button
                onClick={formSubmitHandler}
                className="bg-gray-300 hover:bg-gray-400 rounded-3xl mt-3 text-gray-800 font-bold py-2 px-4 inline-flex items-center justify-center"
            >
                <span className="px-8 py-2">Confirm</span>
            </button>
        </div>
    );
};

export default NewPassword;
