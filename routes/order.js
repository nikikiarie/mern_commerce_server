const Order = require('../models/Order')

const router = require('express').Router()

router.get("/",  async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });




router.get('/income',async(req,res)=>{
const date = new Date()
const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

try {
    
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
         
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$subTotal",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
   
})



module.exports = router