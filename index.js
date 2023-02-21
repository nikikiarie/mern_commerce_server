const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripe");


dotenv.config();

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(5000, () => console.log("connected"));
  console.log(` db connected `);
});

app.use(cors());


app.use("/api/checkout/webhook",express.raw({type:"*/*"}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", stripeRoutes);


app.get("/", (req, res) => {
  res.send("working");
});
