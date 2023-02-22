const express = require("express");
const Order = require("../models/Order");
const dotenv = require("dotenv");




const { verifyToken } = require("../verifyToken");
const router = express.Router();
const KEY = process.env.MONGO_URL;
console.log({"key:":KEY});
const stripe = require("stripe")(
  "sk_test_51M0iNJEVh4wUNDFXckLHggev0s0oqMqu3EXCZB429SzjBKm1by4ucNEEa7MeZSXEcUW7ZBggD1Lidb1gf7APU4Yg00EZZc2f2d"
);


const CLIENT = dotenv.config().parsed.CLIENT_URL





router.post("/payment", verifyToken,async (req, res) => {
  const cartItems = req.body.cartItems.map((item) => {
    return {
      quantity: item.quantity,
      title: item.title,
      id: item._id,
      price: item.price,
    };
  });
  console.log(cartItems);

  // create a  Stripe customer

  const customer = await stripe.customers.create({
    metadata: {
      userid: req.body.userId,
      cart: JSON.stringify(cartItems),
    },
  });

  // line_items

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  console.log(line_items);

  try {
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: { allowed_countries: ["US", "CA", "KE"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],

      phone_number_collection: { enabled: true },
      line_items: line_items,
      customer: customer.id,
      mode: "payment",
      success_url: `${CLIENT}/success`,
      cancel_url: `${CLIENT}/cart`,
    });
   
    res.send({ url: session.url });
  } catch (err) {
    res.status(500).send({ mg: err });
  }
});

// create Order

const createOrder = async (customer, data) => {
  const orderItems = JSON.parse(customer.metadata.cart);

  const newOrder = new Order({
    userId: customer.metadata.userid,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: orderItems,
    subTotal: data.amount_subtotal,
    total: data.amount_total,

    shipping: data.customer_details,
    paymentStatus: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();

    console.log("Processesced order", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

//stripe webhook

const endpointSecret =
  "whsec_dfd33e15bc2e22f6bb0d2771f558e4760cbb19fe5f08e22ff8ec2c16ac0073a9";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
console.log(event);

      if (event.type === "checkout.session.completed") {
        stripe.customers
          .retrieve(event.data.object.customer)
          .then((customer) => {
            

            createOrder(customer, event.data.object);
          });
      }
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  }
);

module.exports = router;
