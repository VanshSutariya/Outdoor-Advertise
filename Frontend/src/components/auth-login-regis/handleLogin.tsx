import { Dispatch } from "redux";
import { decode } from "jsonwebtoken";
import { loginIn } from "@/store/auth-slice";
import toastFunction from "../reactToast/toast";
import { cartActions } from "@/store/cart-slice";
import fetchUser, { fetchCartData } from "@/utils/http";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DecodedToken {
  id: string;
}

export const handleLogin = async (
  data: { email: string; password: string },
  dispatch: Dispatch,
  router: AppRouterInstance
) => {
  try {
    const email = data.email;
    const password = data.password;

    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const resData = await response.json();

    if (!response.ok) throw new Error(resData.message || "Invalid Credentials");

    document.cookie = `jwt=${resData.token}; expires=${new Date(
      new Date().getTime() + 12 * 60 * 60 * 1000
    )}; path=/; secure;`;

    const decodedToken = decode(resData.token) as DecodedToken;

    if (decodedToken) {
      const userDetail = await fetchUser(decodedToken.id);
      dispatch(loginIn({ userDetail, resData }));
      const cartData = await fetchCartData(decodedToken.id);
      dispatch(cartActions.setCartItems(cartData));
      toastFunction("success", "Login Successful!");
      router.push(
        userDetail.role === "admin" ? "/outdoorAd/admin" : "/outdoorAd"
      );
    }
  } catch (error: any) {
    toastFunction("error", error.message);
  }
};

export const handleGoogleLoginSuccess = async (
  codeResponse: { access_token: string },
  dispatch: Dispatch,
  router: AppRouterInstance
) => {
  try {
    const response = await fetch("http://localhost:4000/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: codeResponse.access_token }),
    });
    const resData = await response.json();

    if (!response.ok) throw new Error(resData.message || "Google Login Failed");

    document.cookie = `jwt=${resData.token}; expires=${new Date(
      new Date().getTime() + 12 * 60 * 60 * 1000
    )}; path=/; secure;`;
    const decodedToken = decode(resData.token) as DecodedToken;

    if (decodedToken) {
      const userDetail = await fetchUser(decodedToken.id);
      dispatch(loginIn({ userDetail, resData }));
      const cartData = await fetchCartData(decodedToken.id);
      dispatch(cartActions.setCartItems(cartData));
      toastFunction("success", "Login Successful!");
      router.push(
        userDetail.role === "admin" ? "/outdoorAd/admin" : "/outdoorAd"
      );
    }
  } catch (error: any) {
    toastFunction("error", error.message);
  }
};
