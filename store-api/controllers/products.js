const Product = require("../models/product");

const getAllProductsTest = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, quantity: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObj = {};
  // FEARURED
  if (featured) {
    queryObj.featured = featured === "true" ? true : false;
  }
  // COMPANY
  if (company) {
    queryObj.company = company;
  }
  // NAME
  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }

  // NUMERIC FILTERS
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|=|>=|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObj);
  // SORTING
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // FIELDS
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // LIMIT & PAGE
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ products, Quantity: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsTest,
};
