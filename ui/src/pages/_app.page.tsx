import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'; 

import '@fortawesome/fontawesome-free/css/all.min.css';

import './reactCOIServiceWorker';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlobalStateProvider } from '@/context/GlobalState';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </GlobalStateProvider>
  )
  ;
}
