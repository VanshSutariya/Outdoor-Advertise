import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";

export function SignIn() {
  const router = useRouter();
  const [errorState, setErrorState] = useState(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required").min(6),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data) {
    const { email, password } = data;
    console.log(data);
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const resData = await response.json();

      if (!response.ok)
        throw new Error(resData.message || "Invalid Credentials");

      alert("Login Successfully");
      router.push("/");
    } catch (error) {
      setErrorState(error.message);
      console.log(error.message);
    }
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <div variant="h2" className="font-bold mb-4 text-4xl">
            LogIn
          </div>
          <div
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to LogIn
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="flex flex-col ">
            <label className="font-medium mb-2">Your email</label>
            <input
              {...register("email")}
              name="email"
              onChange={() => {
                setErrorState(null);
              }}
              placeholder="name@mail.com"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
              labelprops={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.email?.message}
            </div>
            <label className="mb-2 font-medium">Password</label>
            <input
              {...register("password")}
              onChange={() => {
                setErrorState(null);
              }}
              name="password"
              type="password"
              placeholder="*******"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
              labelprops={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.password?.message}
            </div>
          </div>
          {errorState && (
            <div className="text-red-500 ml-2 mt-2 mb-2rounded-sm p-2 text-center font-bold">
              {errorState}
            </div>
          )}
          <button className="text-black font-bold p-3 bg-slate-200 w-full">
            LogIn
          </button>
          <div
            variant="paragraph"
            className="text-center text-blue-500 font-medium mt-4"
          >
            Not registered?
            <Link href="/register" className="text-gray-900 ml-1">
              Create account
            </Link>
          </div>
        </form>
      </div>
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
    </section>
  );
}

export default SignIn;

// height: 924 px width: 646 px
