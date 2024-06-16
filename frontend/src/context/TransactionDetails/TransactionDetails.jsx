import { createContext, useContext, useState } from "react";

const transactionContext = createContext();

const TransactionDetailsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState("March");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <transactionContext.Provider
      value={{
        isLoading,
        setIsLoading,
        month,
        setMonth,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </transactionContext.Provider>
  );
};
const useTransactionContext = () => useContext(transactionContext);

export { TransactionDetailsProvider, useTransactionContext };
