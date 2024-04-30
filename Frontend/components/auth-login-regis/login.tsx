import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginIn, logout } from '../../store/auth-slice';
import { decode } from 'jsonwebtoken';
import ForgotPassword from './forgetPasswordPopUp';
import fetchUser from '../../utils/http';
import React from 'react';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../../store';
import ToastComponent from '../reactToast/toast';
import toastFunction from '../reactToast/toast';
// import Cookies from "js-cookie";

const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showForgotpassword, setShowForgotPassword] = useState(false);
  const {
    userId,
    userName,
    isLoggedIn,
    userRole,
  }: {
    userId: string | null;
    userName: string | null;
    isLoggedIn: boolean;
    userRole: string | null;
  } = useSelector((state: RootState) => state.auth);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required').min(6),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const handleLoginSuccess = () => {
    toastFunction('success', 'Login Successful!');
  };

  const handleLoginError = (errorMessage: string) => {
    toastFunction('error', errorMessage);
  };

  async function onSubmit(data: { email: string; password: string }) {
    const { email, password } = data;
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const resData = await response.json();

      if (!response.ok)
        throw new Error(resData.message || 'Invalid Credentials');

      document.cookie = `jwt=${resData.token}; expires=${new Date(
        new Date().getTime() + 20 * 60 * 1000,
      )}; path=/; secure;`;

      const decodedToken = decode(resData.token) as { id: string };
      if (decodedToken) {
        const fetchUserFunc = async () => {
          const userDetail = await fetchUser(decodedToken.id);
          dispatch(loginIn(userDetail));

          handleLoginSuccess();
          if (userDetail?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        };

        fetchUserFunc();
      }
    } catch (error) {
      handleLoginError(error.message);
    }
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPasswordPopup = () => {
    setShowForgotPassword(false);
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <div className="font-bold mb-4 text-4xl">LogIn</div>
          <div className="text-lg font-normal">
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
              {...register('email')}
              name="email"
              placeholder="name@mail.com"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.email?.message}
            </div>
            <label className="mb-2 font-medium">Password</label>
            <input
              {...register('password')}
              name="password"
              type="password"
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
          <button
            // onClick={handleErrorToast}
            className="rounded-lg font-bold font-poppins p-3 bg-slate-200 w-full hover:bg-slate-300 active:bg-slate-200"
          >
            LogIn
          </button>

          <div className="text-center text-blue-500 font-medium mt-4">
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
          className="rounded-3xl"
          width={600}
          height={800}
          priority
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

export default SignIn;
