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
  "/outdoorAd/createPoster": ["member", "admin"],
};

export default function middleware(req: NextRequest) {
  const cookies = req.cookies.get("jwt");

  const token = cookies?.value;

  if (token) {
    try {
      const decodedToken: any = decode(token);

      const isLoggedIn = decodedToken.id && decodedToken.role ? true : false;
      const userRole = decodedToken.role;
      console.log(userRole);

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
      } else if (
        protectedRoutes.some((route) => requestedRoute.startsWith(route))
      ) {
        if (userRole !== "admin" && userRole !== "member") {
          const loginUrl = new URL("/outdoorAd/login", req.nextUrl.origin);
          return NextResponse.redirect(loginUrl.toString());
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else if (
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/outdoorAd/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl.toString());
  }

  return NextResponse.next();
}
