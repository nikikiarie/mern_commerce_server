const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    customerId:{type:String},
    paymentIntentId:{type:String},
    products: [
      {
        id: { type: String, required: true },
        title: { type: String },
        quantity: { type: Number, default: 1 },
        price:{type:String}
      },
    ],
    subTotal: { type: Number, required: true },
    total:{type:String, required: true},
    shipping:{type:Object, required: true},
    status: { type: String, default: "pending" },
    paymentStatus:{ type: String ,required:true},
  },
  { timestamps: true }
);




module.exports = mongoose.model("Order", orderSchema);
