import '../styles/globals.css';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Provider, useDispatch } from 'react-redux';
import store, { persistor } from '../store/index';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';

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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
