const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/all_users").get((req, res) => {
  console.log("all_users api hit!");

  try {
    const result = prisma.user
      .findMany({
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      })
      .then((query_res) => {
        if (query_res) {
          res.status(200).json({
            users: query_res,
          });
        } else {
          res.status(404).json({ status: "users not found" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error while getting users: ", error.message);
    res.status(500).json({
      error_message: "Error while getting users!",
    });
  }
});

module.exports = router;
