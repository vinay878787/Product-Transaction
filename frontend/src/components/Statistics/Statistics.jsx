import React, { useEffect, useState } from "react";
import styles from "./Statistics.module.css";
import { useTransactionContext } from "../../context/TransactionDetails/TransactionDetails";
import { getStatistics } from "../../api/api";
import Loader from "../../components/Loader/Loader"

function Statistics() {
  const { month, searchQuery,isLoading,setIsLoading  } = useTransactionContext();
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await getStatistics(month);
      console.log(response);
      setStatistics({
        totalSales: response.data.totalSaleAmount,
        totalSoldItems: response.data.totalSoldItems,
        totalNotSoldItems: response.data.totalNotSoldItems,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month, searchQuery]);

  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.statisticsContainer}>
      <h2>Statistics</h2>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Sales:</span>
          <span className={styles.statValue}>₹{statistics.totalSales}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Sold Items:</span>
          <span className={styles.statValue}>{statistics.totalSoldItems}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Not Sold Items:</span>
          <span className={styles.statValue}>
            {statistics.totalNotSoldItems}
          </span>
        </div>
      </div>
    </div>
    </>
  );
}

export default Statistics;
