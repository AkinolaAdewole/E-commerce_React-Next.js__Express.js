"use client";

import { useWixClient } from "../../hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

const MODE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  RESET_PASSWORD: "RESET_PASSWORD",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
};

const LoginPage = () => {
  const wixClient = useWixClient();
  const router = useRouter();

  const isLoggedIn = wixClient.auth.loggedIn();

  if (isLoggedIn) {
    router.push("/");
  }

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

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
      
        try {
          let response;
      
          switch (mode) {
            case MODE.LOGIN:
              // POST request for signin
              response = await fetch("http://localhost:4200/user/signin", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email,
                  password,
                }),
              });
              break;
            case MODE.REGISTER:
              // POST request for signup
              response = await fetch("http://localhost:4200/user/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email,
                  password,
                  firstname, lastname, phonenumber, // Include additional fields as needed
                }),
              });
              break;
            case MODE.RESET_PASSWORD:
              response = await wixClient.auth.sendPasswordResetEmail(
                email,
                window.location.href
              );
              setMessage("Password reset email sent. Please check your e-mail.");
              break;
            case MODE.EMAIL_VERIFICATION:
              response = await wixClient.auth.processVerification({
                verificationCode: emailCode,
              });
              break;
            default:
              break;
          }
      
          const data = await response.json(); // Parse JSON response
          if (!response.ok) {
            throw new Error(data.message || "An error occurred");
          }
      
          // Handle response for login and register
          switch (mode) {
            case MODE.LOGIN:
              if (data.success) { // Assuming the API responds with a success flag
                setMessage("Successful! You are being redirected.");
                const tokens = data.tokens; // Update with actual token structure
                
                Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
                  expires: 2,
                });
                router.push("/"); // Redirect on success
              } else {
                setError(data.message || "Something went wrong!");
              }
              break;
      
            case MODE.REGISTER:
              if (data.success) { // Assuming the API responds with a success flag
                setMessage("Registration successful! You can now log in.");
                setMode(MODE.LOGIN); // Optionally switch to login mode
              } else {
                setError(data.message || "Registration failed!");
              }
              break;
      
            // Handle other modes as needed
            default:
              break;
          }
        } catch (err) {
          console.error(err);
          setError("Something went wrong!");
        } finally {
          setIsLoading(false);
        }
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
          />
        </div>
      )}
  
      {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="ring-2 ring-gray-300 rounded-md p-2"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      ) : null}
  
      {mode === MODE.LOGIN && (
        <div
          className="text-sm underline cursor-pointer"
          onClick={() => setMode(MODE.RESET_PASSWORD)}
        >
          Forgot Password?
        </div>
      )}
      
      <button
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
