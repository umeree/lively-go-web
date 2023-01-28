const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/login_user").get((req, res) => {
  console.log("login_user api hit!");

  const { email, password } = req.body;

  try {
    const result = prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then(() => {
        console.log(result);
        res.status(200).json({ message: "found user!" });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error while loging in user: ", error.message);
    res.status(500).json({
      error_message: "Error while loggin user!",
    });
  }
});

router.route("/register_user").post((req, res) => {
  console.log("Register_user api hit!");

  const { first_name, last_name, email, password } = req.body;
  console.log(req.body);

  try {
    const result = prisma.user
      .create({
        data: {
          first_name,
          last_name,
          email,
          password,
        },
      })
      .then(() => {
        console.log(result);
        res.status(200).json({ message: "created!" });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error while registering user: ", error.message);
    res.status(500).json({
      error_message: "Error while registering user!",
    });
  }
});

module.exports = router;
