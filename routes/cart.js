const Order = require("../models/Order");
const { verifyToken, verifyTokenAndUser, verifyTokenAndAdmin } = require("../verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order({ ...req.body });
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    const newOrder = new Order({ ...req.body });
    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
