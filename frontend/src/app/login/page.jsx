"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import axios from "axios";

const MODE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  RESET_PASSWORD: "RESET_PASSWORD",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
};

const LoginPage = () => {
  const router = useRouter();

  const [mode, setMode] = useState(MODE.LOGIN);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    setIsLoading(true); // Start loading

    switch (mode) {
      case MODE.LOGIN:
        signin();
        break;
      case MODE.REGISTER:
        register();
        break;
      case MODE.RESET_PASSWORD:
        resetPassword(); // You will need to implement this function
        break;
      case MODE.EMAIL_VERIFICATION:
        verifyEmail(); // You will need to implement this function
        break;
      default:
        break;
    }
  };

  const register = () => {
    const newAccount = {
      firstname,
      lastname,
      phonenumber,
      email,
      password,
    };

    axios
      .post("http://localhost:4200/user/signup", newAccount)
      .then((result) => {
        if (result.data.response) {
          setMessage(result.data.message); // Assuming success message
          // Optionally redirect or reset the form here
        } else {
          setMessage(result.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Registration failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });
  };

  const signin = () => {
    const details = { email, password };

    axios.post("http://localhost:4200/user/signin", details)
      .then((result) => {
        if (result.data.response) {
          const { user, token, message } = result.data;
          Cookies.set("token", token);
          // console.log(user.lastname);
          const userLastname = user.lastname;
          router.push("/${userlastname}");
        } else {
          setMessage(result.data.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        // console.error("Error:", error.message || error);
        setMessage("An error occurred during login. Please try again.");
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  
  const resetPassword = () => {
  
  };

  const verifyEmail = () => {
    
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">{formTitle}</h1>

        {mode === MODE.REGISTER && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                className="ring-2 ring-gray-300 rounded-md p-2"
                onChange={(e) => setFirstname(e.target.value)}
                required // Added required attribute for form validation
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                className="ring-2 ring-gray-300 rounded-md p-2"
                onChange={(e) => setLastname(e.target.value)}
                required // Added required attribute for form validation
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phonenumber"
                placeholder="Phone Number"
                className="ring-2 ring-gray-300 rounded-md p-2"
                onChange={(e) => setPhonenumber(e.target.value)}
                required 
              />
            </div>
          </>
        )}

        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="ring-2 ring-gray-300 rounded-md p-2"
              onChange={(e) => setEmail(e.target.value)}
              required // Added required attribute for form validation
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-2"
              onChange={(e) => setEmailCode(e.target.value)}
              required // Added required attribute for form validation
            />
          </div>
        )}

        {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-2"
              onChange={(e) => setPassword(e.target.value)}
              required // Added required attribute for form validation
            />
          </div>
        )}

        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.RESET_PASSWORD)}
          >
            Forgot Password?
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md disabled:bg-blue-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonTitle}
        </button>

        {error && <div className="text-red-600">{error}</div>}

        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.REGISTER)}
          >
            {"Don't"} have an account?
          </div>
        )}

        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Have an account?
          </div>
        )}

        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Go back to Login
          </div>
        )}

        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
