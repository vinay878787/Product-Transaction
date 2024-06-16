const express = require("express");
const transaction = require("../controllers/transactions");
const router = express.Router();

router.get("/initialize", transaction.initializeDataInDatabase);
router.get("/fetch", transaction.fetchDataBySearch);
router.get("/sales", transaction.getStatistics);
router.get("/barChart", transaction.getBarChart);
router.get("/pieChart", transaction.getPieChart);
router.get("/combinedData", transaction.getCombinedData);

module.exports = router;
