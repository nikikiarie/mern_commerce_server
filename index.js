const express = require("express");
const dotenv = require("dotenv");
const path = require("path")
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config()


const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripe");



const app = express();
const PORT = process.env.PORT || 5000
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(PORT, () => console.log("connected"));
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


