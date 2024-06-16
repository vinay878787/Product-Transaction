import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { TransactionDetailsProvider } from "./context/TransactionDetails/TransactionDetails.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TransactionDetailsProvider>
      <App />
    </TransactionDetailsProvider>
  </React.StrictMode>
);
