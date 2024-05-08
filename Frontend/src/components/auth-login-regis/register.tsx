"use client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toastFunction from "../reactToast/toast";

const SignUp: React.FC = () => {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("First Name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required").min(6),
    confirmPassword: Yup.string()
      .required("Password is required")
      .min(6)
      .oneOf(
        [Yup.ref("password")],
        "ConfirmPassword and Passwords must be same."
      ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const { username: name, email, password, confirmPassword } = data;

    try {
      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Enter valid inputs.");

      toastFunction("success", "Register Successfully");
      router.push("/outdoorAd/login");
    } catch (error: any) {
      toastFunction("error", error.message);
    }
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-2/5 h-full hidden lg:block">
        <Image
          src="/pattern3.png"
          alt="signin image"
          className=" rounded-3xl"
          width={600}
          height={800}
          priority
        />
      </div>
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <div className="font-bold mb-4 text-4xl">Join Us Today</div>
          <div className="text-lg font-normal">
            Enter your email and password to Register.
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="flex flex-col ">
            <p className="font-medium mb-2">Your Name</p>
            <input
              {...register("username")}
              name="username"
              type="text"
              placeholder="doodle"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2-mt-2 mb-2">
              {errors.username?.message}
            </div>
            <p className="font-medium mb-2">Your email</p>
            <input
              {...register("email")}
              type="text"
              name="email"
              placeholder="name@mail.com"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />

            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.email?.message}
            </div>

            <p className="mb-2 font-medium">Password</p>
            <input
              {...register("password")}
              name="password"
              type="password"
              placeholder="********"
              className=" p-2 mb-3 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.password?.message}
            </div>

            <p className="mb-2 font-medium">Confirm Password</p>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="********"
              className=" p-2 mb-3 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2 -mt-2 mb-3">
              {errors.confirmPassword?.message}
            </div>
          </div>

          <button className="rounded-lg font-bold font-poppins p-3 bg-slate-200 w-full hover:bg-slate-300 active:bg-slate-200 ">
            Register
          </button>

          <div className="text-center text-blue-500 font-medium mt-4">
            Already registered?
            <Link href="/login" className="text-gray-900 ml-1">
              Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
