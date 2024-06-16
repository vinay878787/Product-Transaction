import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/Loader/Loader";
import { useTransactionContext } from "../../context/TransactionDetails/TransactionDetails";
import { getBarChart } from "../../api/api";
import styles from "./BarChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const { month, searchQuery, isLoading, setIsLoading } =
    useTransactionContext();
  const [barChartData, setBarChartData] = useState([]);

  const fetchBarChartData = async () => {
    try {
      setIsLoading(true);
      const response = await getBarChart(month);
      setBarChartData(response.data); // Assuming the response structure
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [month, searchQuery]);

  const labels = barChartData.map((item) => item.range);
  const counts = barChartData.map((item) => item.count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Count",
        data: counts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Count by Range",
      },
    },
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.barChartContainer}>
        <div className={styles.heading}>Bar Chart for the given data</div>
        <Bar data={chartData} options={options} />
      </div>
    </>
  );
};

export default BarChart;
