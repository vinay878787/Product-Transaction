import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const getTransactions = async (month, search, page) => {
  const response = await axios.get(`${baseURL}/fetch`, {
    params: { month, search, page },
  });
  // console.log("response", response);
  return response;
};

export const getStatistics = async (month) => {
  const response = await axios.get(`${baseURL}/sales`, {
    params: { month },
  });
  // console.log("response", response);
  return response;
};

export const getBarChart = async (month) => {
  const response = await axios.get(`${baseURL}/barChart`, {
    params: { month },
  });
  // console.log("response", response);
  return response;
};

export const getPieChart = async (month) => {
  const response = await axios.get(`${baseURL}/pieChart`, {
    params: { month },
  });
  // console.log("response", response);
  return response;
};

export const getCombinedData = async (month) => {
  const response = await axios.get(`${baseURL}/combinedData`, {
    params: { month },
  });
  // console.log("response", response);
  return response;
};
