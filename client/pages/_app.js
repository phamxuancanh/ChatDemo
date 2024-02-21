// _app.js hoặc app.js
import { Provider as ReduxProvider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import store from '@/app/store';
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ReduxProvider>
  );
}

export default MyApp;
