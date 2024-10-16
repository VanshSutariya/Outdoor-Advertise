import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/store/provider";
import { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "OutdoorAd",
  description:
    "OutdoorAd: Simplifying outdoor advertising for advertisers & media owners. Plan, buy & track campaigns in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GMAPS_KEY}&loading=async&libraries=places&callback=Function.prototype`}
        ></script>
      </head>

      <body>
        <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
          <Providers>
            {children}
            <ToastContainer />
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
