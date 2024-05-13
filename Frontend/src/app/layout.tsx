import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/store/provider";
import { Metadata } from "next";

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
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
