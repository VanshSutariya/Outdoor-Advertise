import "../styles/globals.css";
import Head from "next/head";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
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

export default App;
