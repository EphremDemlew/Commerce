const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./server/config/connection");
const productsRoute = require("./server/routes/ProductsRouter");
const cartRoute = require("./server/routes/CartRouter");
const authRoute = require("./server/routes/auth");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

//morgan
app.use(morgan("tiny"));

//mongoDb
connectDB();

//middlewares
app.use(express.json());
app.use("/api/products", productsRoute);
app.use("/api/carts", cartRoute);
app.use("/api/user", authRoute);

app.listen(PORT, () => {
  console.log(`server strted on port ${PORT}`);
});
