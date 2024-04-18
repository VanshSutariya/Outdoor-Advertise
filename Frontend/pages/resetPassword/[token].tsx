import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth-slice";

const ResetPasswordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<string | null>("");
  const [isError, setIsError] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required").min(6),
    confirmPassword: Yup.string()
      .required("Password is required")
      .min(6)
      .oneOf(
        [Yup.ref("password"), null],
        "ConfirmPassword and Passwords must be same."
      ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const reset_token: string | string[] | undefined = router.query.token;

  async function onSubmit(data: { password: string; confirmPassword: string }) {
    setIsError(false);
    console.log(data);

    const { password } = data;

    try {
      const response = await fetch(
        "http://localhost:4000/auth/reset-password",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, reset_token }),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Enter valid inputs.");

      alert("Password reset successfully");
      document.cookie =
        "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/resetPassword;";
      dispatch(logout());

      router.push("/login");
    } catch (error) {
      setIsError(true);
      setErrorState(error.message);
      console.log(error.message);
    }
  }

  return (
    <section className="justify-center m-8 flex gap-4">
      <div className=" w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <div className="font-bold mb-4 text-4xl">Password Reset</div>
          <div className="text-lg font-normal">
            Enter your new password to Reset Password.
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="flex flex-col ">
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

          <button className="p-3 text-black font-bold bg-slate-200 w-full ">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
