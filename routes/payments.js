const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(
  "sk_test_51MB2yjHR3ue7I09LEFcbYbW0jZJ83W8FBGZR9w4WH7NUxJeM4m1HIypzrcNNkoYloZSzr5cjvkZXtv34yeP0Pcff00CvI5H6n1"
);

//Create an intent for payment to validate on client
router.route("/create-payment-intent").get(async (req, res) => {
  if (req.method != "GET") {
    return res.status(500).json({
      error: "Method not allowed!",
    });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999,
      currency: "usd",
    });
    const clientSecret = paymentIntent.client_secret;
    console.log(clientSecret);
    res.status(200).json({
      clientSecret,
    });
    // Pass the client secret to the client
  } catch (error) {
    console.log("error while getting payment intent: ", error.message);
    res.status(500).json({
      status: 500,
      error: "Error while getting payment intent",
    });
  }
});

router.route("/set-hearts").get(async (req, res) => {
  if (req.method != "GET") {
    return res.status(500).json({
      error: "Method not allowed!",
    });
  }
  const { userId } = req.query;
  try {
    const data = await prisma.user
      .findUnique({
        where: {
          id: parseInt(userId),
        },
      })
      .then((r) => {
        console.log(r);
        return r;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: 500,
          error: "Error while setting hearts",
        });
      });

    if (data) {
      const response = prisma.user
        .update({
          where: {
            id: parseInt(userId),
          },
          data: {
            hearts: parseInt(data.hearts + 1000),
          },
        })
        .then((response) => {
          res.status(200).json({ message: "hearts added" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            status: 500,
            error: "Error while setting hearts",
          });
        });
    }
  } catch (error) {
    console.log("error while setting hearts: ", error.message);
    res.status(500).json({
      status: 500,
      error: "Error while setting hearts",
    });
  }
});
module.exports = router;
