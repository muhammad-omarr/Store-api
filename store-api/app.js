//imports
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const notFoundMW = require("./middleware/not-found");
const errorHandlerMW = require("./middleware/error-handler");
const productsRouter = require("./routes/products");

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send(
    '<h1>STORE API</h1><br><a href="/api/v1/products">PRODUCTS ROUTE</a>'
  );
});

app.use("/api/v1/products", productsRouter);

//middleware
app.use(notFoundMW);
app.use(errorHandlerMW);

//connecting to DB and SERVER
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    // connect to db
    await connectDB(process.env.MONGO_URI);
    console.log("CONNECTED TO DATABASE");
    app.listen(PORT, console.log("SERVER LISTENING ON PORT:", PORT));
  } catch (error) {
    console.log(error);
  }
};

start();
