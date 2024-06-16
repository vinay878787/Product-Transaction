const Product = require("../models/product");
const { capitalizeMonth } = require("../utils/helpers");
const axios = require("axios");
const baseURL = process.env.BACKEND_BASE_URL;
const initializeDataInDatabase = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data;
    console.log("PRODUCTS", products);

    const result = await Product.insertMany(products);
    console.log(result);

    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (error) {
    next(error);
  }
};

const fetchDataBySearch = async (req, res, next) => {
  let { month, search, page } = req.query;
  const perPage = 10;
  const pipeline = [];

  try {
    if (!page || isNaN(page) || parseInt(page) <= 0) {
      page = 1;
    } else {
      page = parseInt(page);
    }

    // Convert the month name to a month number (1-12)
    const monthNumber = month
      ? new Date(`${capitalizeMonth(month)} 1, 2024`).getMonth() + 1
      : null;

    if (monthNumber) {
      pipeline.push({
        $addFields: {
          saleMonth: { $month: "$dateOfSale" },
        },
      });
      pipeline.push({
        $match: { saleMonth: monthNumber },
      });
    }

    if (search) {
      const isNumericSearch = !isNaN(search);

      if (isNumericSearch) {
        pipeline.push({
          $match: { price: parseFloat(search) },
        });
      } else {
        pipeline.push({
          $match: {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          },
        });
      }
    }

    // Add pagination stages
    pipeline.push({
      $skip: (page - 1) * perPage,
    });
    pipeline.push({
      $limit: perPage,
    });

    const products = await Product.aggregate(pipeline);
    const total = await Product.countDocuments();

    res.status(200).json({ total, products });
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  const { month } = req.query;

  try {
    if (!month) {
      return res
        .status(400)
        .json({ message: "Month query parameter is required" });
    }

    // Convert the month name to a month number (1-12)
    const monthNumber =
      new Date(`${capitalizeMonth(month)} 1, 2024`).getMonth() + 1;
    //total sale amount of selected month
    const stats = await Product.aggregate([
      {
        $addFields: {
          saleMonth: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          saleMonth: monthNumber,
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: {
              $cond: { if: { $eq: ["$sold", true] }, then: "$price", else: 0 },
            },
          },
          totalSoldItems: {
            $sum: { $cond: { if: { $eq: ["$sold", true] }, then: 1, else: 0 } },
          },
          totalNotSoldItems: {
            $sum: {
              $cond: { if: { $eq: ["$sold", false] }, then: 1, else: 0 },
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalSaleAmount: 0,
      totalSoldItems: 0,
      totalNotSoldItems: 0,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getBarChart = async (req, res, next) => {
  const { month } = req.query;

  try {
    if (!month) {
      return res
        .status(400)
        .json({ message: "Month query parameter is required" });
    }

    // Convert the month name to a month number (1-12)
    const monthNumber =
      new Date(`${capitalizeMonth(month)} 1, 2024`).getMonth() + 1;

    // Fetch all products sold in the specified month
    const products = await Product.aggregate([
      {
        $addFields: {
          saleMonth: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          saleMonth: monthNumber,
        },
      },
    ]);

    // Initialize the counts for each range
    const ranges = [
      { range: "0 - 100", count: 0 },
      { range: "101 - 200", count: 0 },
      { range: "201 - 300", count: 0 },
      { range: "301 - 400", count: 0 },
      { range: "401 - 500", count: 0 },
      { range: "501 - 600", count: 0 },
      { range: "601 - 700", count: 0 },
      { range: "701 - 800", count: 0 },
      { range: "801 - 900", count: 0 },
      { range: ">900", count: 0 },
    ];

    // Count the products in each price range
    products.forEach((product) => {
      if (product.price <= 100) ranges[0].count++;
      else if (product.price <= 200) ranges[1].count++;
      else if (product.price <= 300) ranges[2].count++;
      else if (product.price <= 400) ranges[3].count++;
      else if (product.price <= 500) ranges[4].count++;
      else if (product.price <= 600) ranges[5].count++;
      else if (product.price <= 700) ranges[6].count++;
      else if (product.price <= 800) ranges[7].count++;
      else if (product.price <= 900) ranges[8].count++;
      else ranges[9].count++;
    });

    res.status(200).json(ranges);
  } catch (error) {
    next(error);
  }
};

const getPieChart = async (req, res, next) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).send({ error: "Month is required" });
  }

  try {
    // Convert the month name to a month number (1-12)
    const monthNumber =
      new Date(`${capitalizeMonth(month)} 1, 2024`).getMonth() + 1;

    // Fetch all products sold in the specified month
    const products = await Product.aggregate([
      {
        $addFields: {
          saleMonth: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          saleMonth: monthNumber,
        },
      },
    ]);

    // Count items in each category
    const categoryCount = products.reduce((acc, product) => {
      if (acc[product.category]) {
        acc[product.category]++;
      } else {
        acc[product.category] = 1;
      }
      return acc;
    }, {});

    const result = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));

    // Send the result
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const getCombinedData = async (req, res, next) => {
  const { month } = req.query;

  if (!month) {
    return res
      .status(400)
      .json({ message: "Month query parameter is required" });
  }

  try {
    const endpoints = [
      `${baseURL}/api/v1/sales?month=${month}`,
      `${baseURL}/api/v1/barChart?month=${month}`,
      `${baseURL}/api/v1/pieChart?month=${month}`,
    ];

    // Fetch data from the three APIs in parallel
    const [statisticsResponse, barChartResponse, pieChartResponse] =
      await Promise.all(
        endpoints.map((endpoint) =>
          fetch(endpoint).then((response) => response.json())
        )
      );

    // Combine the responses into a single JSON object
    const combinedResponse = {
      statistics: statisticsResponse,
      barChart: barChartResponse,
      pieChart: pieChartResponse,
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializeDataInDatabase,
  fetchDataBySearch,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};
