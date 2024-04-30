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
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../../store';
// import Cookies from "js-cookie";

const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<string | null>(null);
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

  async function onSubmit(data: { email: string; password: string }) {
    // dispatch(logout());

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
        new Date().getTime() + 5000,
      )}; path=/; secure;`;

      const decodedToken = decode(resData.token) as { id: string };
      if (decodedToken) {
        const fetchUserFunc = async () => {
          const userName = await fetchUser(decodedToken.id);
          dispatch(loginIn(userName));
        };

        fetchUserFunc();
        notify();

        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      setErrorState(error.message);
      console.log(error.message);
    }
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPasswordPopup = () => {
    setShowForgotPassword(false);
  };

  const notify = () =>
    toast.success('Login Success.', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
    });

  useEffect(() => {
    if (errorState) {
      toast.error(errorState, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }
  }, [errorState]);

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
              onChange={() => {
                setErrorState(null);
              }}
              placeholder="name@mail.com"
              className=" p-2 mb-2 rounded-lg bg-slate-100 border-gray-500 focus:!border-t-gray-900"
            />
            <div className="text-red-500 ml-2 -mt-2 mb-2">
              {errors.email?.message}
            </div>
            <label className="mb-2 font-medium">Password</label>
            <input
              {...register('password')}
              onChange={() => {
                setErrorState(null);
              }}
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
          <button className="rounded-lg font-bold font-poppins p-3 bg-slate-200 w-full hover:bg-slate-300 active:bg-slate-200">
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
