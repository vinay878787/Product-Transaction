import { useEffect, useState } from "react";
import Statistics from "../../components/Statistics/Statistics";
import Filter from "../../components/Filter/Filter";
import { useTransactionContext } from "../../context/TransactionDetails/TransactionDetails";
import Search from "../../components/Search/Search";
import { getCombinedData, getTransactions } from "../../api/api";
import BarChart from "../../components/BarChart/BarChart";
import Loader from "../../components/Loader/Loader";
import styles from "./Home.module.css";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const { month, searchQuery, setSearchQuery, isLoading, setIsLoading } =
    useTransactionContext();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const results = await Promise.allSettled([
        getTransactions(month, searchQuery, currentPage),
        getCombinedData(month),
      ]);

      const transactionResult = results[0];
      const combinedDataResult = results[1];
      console.log(combinedDataResult);
      setIsLoading(false);
      if (transactionResult.status === "fulfilled") {
        const transactionData = transactionResult.value.data;
        setTransactions(transactionData.products);
        setTotalPages(Math.ceil(transactionData.total / 10));
      } else {
        console.error(transactionResult.reason);
      }

      if (combinedDataResult.status === "fulfilled") {
        // Handle combined data if needed
      } else {
        console.error(combinedDataResult.reason);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, searchQuery, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const onPageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.container}>
      <div className={styles.featureContainer}>
        <Filter />
        <Search onSearch={handleSearch} />
      </div>

      {transactions.length > 0 ? (
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Date of Sale</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td>{index + 1}</td>
                  <td className={styles.imageCell}>
                    <img src={transaction.image} alt={transaction.title} />
                  </td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>
                    {new Date(transaction.dateOfSale).toLocaleDateString()}
                  </td>
                  <td>{transaction.sold ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.message}>No data available</div>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => onPageChange("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange("next")}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <Statistics />
      <BarChart />
    </div>
    </>
  );
};

export default Home;
