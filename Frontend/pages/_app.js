import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Outdoor Advertise</title>
        <meta
          name="description"
          content="hoarding billboard outdoor advertise."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
