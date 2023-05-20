const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

//Login User Api

router.route("/login_admin").post((req, res) => {
  console.log("login_admin api hit!");

  const { email, password } = req.body;
  console.log(email, password);

  try {
    const result = prisma.user
      .findFirst({
        where: {
          email,
          status: "active",
          role: "admin",
        },
        include: {
          profile: true,
        },
      })
      .then((query_res) => {
        if (query_res && query_res.password == password) {
          const token = jwt.sign({ email: req.body.email }, "secret", {
            expiresIn: "1h",
          });
          console.log(query_res);
          res.status(200).json({
            status: "found",
            email: query_res.email,
            userName: query_res.user_name,
            first_name: query_res.profile.first_name,
            last_name: query_res.profile.last_name,
            phone_number: query_res.profile.phone_number,
            role: query_res.profile.role,
            user_id: query_res.id,
            token,
          });
        } else {
          res.status(404).json({ status: "Email or password are invalid!" });
        }
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

module.exports = router;
