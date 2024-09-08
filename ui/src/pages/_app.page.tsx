import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

import './reactCOIServiceWorker';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TransactionProvider } from '@/context/GlobalState';
import useContractAndWallet from "@/hooks/useContract";

export default function App({ Component, pageProps }: AppProps) {

  const {
    setup,
    accountDoesNotExist,
    hasBeenSetup,
    accountExists,
    onSendTransaction,
    onRefreshCandidates,
    onCountAllVotes
  } = useContractAndWallet();

  return (
    <TransactionProvider
      onSendTransaction={onSendTransaction}
      onRefreshCandidates={onRefreshCandidates}
      onCountAllVotes={onCountAllVotes}
      setup={setup}
      accountDoesNotExist={accountDoesNotExist}
      hasBeenSetup={hasBeenSetup}
      accountExists={accountExists}
    >
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </TransactionProvider>
  );
}
