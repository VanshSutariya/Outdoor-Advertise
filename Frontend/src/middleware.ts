import { decode } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
interface AuthorizedUsers {
  [route: string]: string[];
}
const protectedRoutes = [
  "/outdoorAd/cart",
  "/outdoorAd/admin",
  "/outdoorAd/account",
  "/outdoorAd/createPoster",
  "/outdoorAd/dashboard",
  "/outdoorAd/success",
  "/outdoorAd/updatePassword",
];
const authorizedUsers: AuthorizedUsers = {
  "/outdoorAd/admin": ["admin"],
  "/outdoorAd/dashboard": ["member"],
  "/outdoorAd/createPoster": ["admin", "member"],
  "/outdoorAd/account/orders": ["admin", "member", "user"],
};

export default function middleware(req: NextRequest) {
  const cookies = req.cookies.get("jwt");

  const token = cookies?.value;

  if (token) {
    try {
      const decodedToken: any = decode(token);

      const isLoggedIn = decodedToken.id ? true : false;
      console.log(decodedToken);

      const userRole = decodedToken.role;
      if (!isLoggedIn) {
        const loginUrl = new URL("/outdoorAd/login", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl.toString());
      }

      const requestedRoute = req.nextUrl.pathname;

      if (
        protectedRoutes.includes(requestedRoute) &&
        authorizedUsers[requestedRoute].includes(userRole)
      ) {
        return NextResponse.next();
      } else if (
        protectedRoutes.includes(requestedRoute) &&
        !authorizedUsers[requestedRoute].includes(userRole)
      ) {
        const notAuthorizedUrl = new URL("/outdoorAd", req.nextUrl.origin);
        return NextResponse.redirect(notAuthorizedUrl.toString());
      } else if (requestedRoute === "/outdoorAd/login" && isLoggedIn) {
        const redirectUrl = new URL("/outdoorAd", req.nextUrl.origin);
        return NextResponse.redirect(redirectUrl.toString());
      } else if (
        protectedRoutes.some((route) => requestedRoute.startsWith(route))
      ) {
        if (
          userRole === "user" &&
          requestedRoute === "/outdoorAd/account/orders"
        ) {
          return NextResponse.next();
        }
        if (userRole !== "admin" && userRole !== "member") {
          const loginUrl = new URL("/outdoorAd/login", req.nextUrl.origin);
          return NextResponse.redirect(loginUrl.toString());
        }
        if (
          (userRole === "admin" &&
            requestedRoute.startsWith("/outdoorAd/dashboard/")) ||
          (userRole === "member" &&
            requestedRoute.startsWith("/outdoorAd/admin/"))
        ) {
          const notAuthorizedUrl = new URL("/outdoorAd", req.nextUrl.origin);
          return NextResponse.redirect(notAuthorizedUrl.toString());
        }
      }
    } catch (error) {
      console.error("Warningj decoding token:", error);
    }
  } else if (
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/outdoorAd/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl.toString());
  }

  return NextResponse.next();
}
