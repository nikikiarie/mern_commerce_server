const Product = require("../models/Product");
const { verifyTokenAndAdmin, verifyToken } = require("../verifyToken");

const router = require("express").Router();

router.get("/", async (req, res) => {
  
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
        products = await Product.find()
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err);

  }
});

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  console.log(req.body);
  const newProduct = new Product({ ...req.body });

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("product delelted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/:id",  async (req, res) => {
  try {
    const oneProduct = await Product.findById(req.params.id);
    res.status(200).json(oneProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
