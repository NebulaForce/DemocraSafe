import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'; 

import '@fortawesome/fontawesome-free/css/all.min.css';

import './reactCOIServiceWorker';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
