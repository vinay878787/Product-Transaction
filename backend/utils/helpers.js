const capitalizeMonth = (month) => {
  return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
};

module.exports = {capitalizeMonth}
