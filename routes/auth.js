const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/login").get((req, res) => {
  console.log("This is login route:", req);
  res.status(200).json({
    message: "This is login page, hello world" + req,
  });
});

router.route("/register_user").post((req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const result = prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password,
      },
    });
    res.status(200).json({ message: result });
  } catch (error) {
    console.log("error while registering user: ", error.message);
    res.status(500).json({
      error_message: "Error while registering user!",
    });
  }
});

module.exports = router;
