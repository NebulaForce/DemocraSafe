import { createContext, useContext, ReactNode } from "react";

type TransactionContextType = {
  hasBeenSetup: boolean;
  accountExists: boolean;
  setup: JSX.Element;
  accountDoesNotExist: JSX.Element;
  onSendTransaction: () => void;
  onRefreshCandidates: () => void;
  onCountAllVotes: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({
    children,
    onSendTransaction,
    onRefreshCandidates,
    onCountAllVotes,
    hasBeenSetup,
    accountExists,
    setup,
    accountDoesNotExist,
  }: {
    children: ReactNode,
    onSendTransaction: () => void, 
    onRefreshCandidates: () => void,
    onCountAllVotes: () => void,
    hasBeenSetup: boolean,
    accountExists: boolean,
    setup: JSX.Element,
    accountDoesNotExist: JSX.Element,
  }) => {
  return (
    <TransactionContext.Provider value={
      { onSendTransaction, onRefreshCandidates, onCountAllVotes, hasBeenSetup, accountDoesNotExist, accountExists, setup}
    }>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};