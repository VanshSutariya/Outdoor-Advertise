"use client";

import * as Yup from "yup";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ForgotPassword from "./forgetPasswordPopUp";
import { useGoogleLogin } from "@react-oauth/google";
import { yupResolver } from "@hookform/resolvers/yup";
import { handleGoogleLoginSuccess, handleLogin } from "./handleLogin";

const LogIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showForgotpassword, setShowForgotPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required").min(6),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPasswordPopup = () => {
    setShowForgotPassword(false);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) =>
      handleGoogleLoginSuccess(codeResponse, dispatch, router),
    onError: (error) => console.log("Login Failed:", error),
  });
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-10">
        <div className="text-center">
          <div className="font-bold mb-4 text-4xl">LogIn</div>
          <div className="text-lg font-normal">
            Enter your email and password to LogIn
          </div>
        </div>
        <form
          onSubmit={handleSubmit((data: FieldValues) =>
            handleLogin(
              data as { email: string; password: string },
              dispatch,
              router
            )
          )}
          data-testid="loginSubmit"
          className="mt-8 mb-2 mx-auto w-full xs:w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="flex flex-col ">
            <label className="font-medium mb-2">Your email</label>
            <input
              {...register("email")}
              name="email"
              data-testid="emailtest"
              placeholder="name@mail.com"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.email?.message}
            </div>
            <label className="mb-2 font-medium">Password</label>
            <input
              {...register("password")}
              name="password"
              type="password"
              data-testid="passwordtest"
              placeholder="*******"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.password?.message}
            </div>
            <p className="mt-2">
              {/* Forgot Password-------------------- */}
              <button
                type="button"
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={handleForgotPasswordClick}
              >
                Forgot your password?
              </button>
            </p>
          </div>
          <button className="rounded-lg font-bold font-poppins p-3 bg-slate-200 w-full hover:bg-slate-300 active:bg-slate-200">
            LogIn
          </button>
        </form>
        <div className=" grid grid-cols-3 mt-4 mb-2 mx-auto w-full xs:w-80 max-w-screen-lg lg:w-1/2 items-center text-gray-500">
          <hr className="border-gray-500" />
          <p className="text-center text-sm">OR</p>
          <hr className="border-gray-500" />
        </div>

        <button
          onClick={() => handleGoogleLogin()}
          className="bg-white border py-2  mt-4 mb-2 mx-auto w-full xs:w-80 max-w-screen-lg lg:w-1/2 rounded-xl  flex justify-center items-center text-sm hover:scale-105 duration-300 "
        >
          <img
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <span className="ml-4 font-poppins">Login with Google</span>
        </button>
        <div className="text-center text-blue-500 font-medium mt-4">
          Not registered?
          <Link href="/outdoorAd/register" className="text-gray-900 ml-1">
            Create account
          </Link>
        </div>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/pattern3.png"
          alt="signin image"
          className="rounded-3xl w-[600px] h-[800px]"
        />
        {showForgotpassword && (
          <ForgotPassword onClose={closeForgotPasswordPopup} />
        )}
        {/* Blur background overlay */}
        {showForgotpassword && (
          <div className="fixed inset-0 bg-black opacity-60"></div>
        )}
      </div>
    </section>
  );
};

export default LogIn;
