"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth-slice";
import NavBar from "@/components/Header";
import toastFunction from "@/components/reactToast/toast";

const UpdatePasswordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<string | null>("");
  const [isError, setIsError] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required("Password is required").min(6),
    currentPassword: Yup.string().required("Password is required").min(6),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    confirmPassword: Yup.string()
      .required("Password is required")
      .min(6)
      .oneOf(
        [Yup.ref("newPassword")],
        "ConfirmPassword and Passwords must be same."
      ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data: {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    setIsError(false);
    const { email, currentPassword, newPassword } = data;
    console.log(data, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    try {
      const response = await fetch(
        "http://localhost:4000/auth/updatePassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, currentPassword, newPassword }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Enter valid inputs.");

      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(logout());
      toastFunction("success", "Password reset successfully");

      router.push("/outdoorAd/login");
    } catch (error: any) {
      setIsError(true);
      setErrorState(error.message);
      console.log(error.message);
    }
  }

  return (
    <>
      <NavBar />
      <section className="justify-center m-8 flex gap-4">
        <div className=" w-full lg:w-3/5 ">
          <div className="text-center">
            <div className="font-bold mb-4 text-4xl">Update Password</div>
            <div className="text-lg font-normal">
              Enter your Current and new Password.
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          >
            <div className="flex flex-col ">
              <p className="mb-2 font-medium">Your Login email</p>
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
              <p className="mb-2 font-medium">Current Password</p>
              <input
                {...register("currentPassword")}
                name="currentPassword"
                type="password"
                placeholder="********"
                className=" p-2 mb-3 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
              />
              <div className="text-red-500 ml-2 -mt-2 mb-2">
                {errors.currentPassword?.message}
              </div>
              <p className="mb-2 font-medium">New Password</p>
              <input
                {...register("newPassword")}
                name="newPassword"
                type="password"
                placeholder="********"
                className=" p-2 mb-3 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
              />
              <div className="text-red-500 ml-2 -mt-2 mb-2">
                {errors.newPassword?.message}
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
            {isError && <p className="text-lg text-red-700">{errorState}</p>}
            <button className="p-3 text-black font-bold bg-slate-200 w-full hover:bg-slate-300 active:bg-slate-200 rounded-lg">
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdatePasswordPage;
