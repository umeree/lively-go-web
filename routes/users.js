const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/all_users").get((req, res) => {
  try {
    const result = prisma.profile
      .findMany()
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

//search user based on user names
router.route("/search_users").get((req, res) => {
  if (req.method != "GET") {
    return res.status(500).json({
      error_message: "Method not allowed!",
    });
  }
  try {
    const { user } = req.query;
    console.log("user:", user);
    const result = prisma.user
      .findMany({
        where: {
          user_name: user,
        },
        include: {
          profile: true,
        },
      })
      .then((query_res) => {
        if (query_res) {
          let formatedData = [];
          query_res.map((res) => {
            formatedData.push({
              user_name: res.user_name,
              first_name: res.profile.first_name,
              last_name: res.profile.last_name,
              role: res.profile.role,
              user_id: res.id,
            });
          });
          console.log("query_res:", formatedData);
          res.status(200).json({
            users: formatedData,
          });
        } else {
          // console.log("hello worl");
          res.status(404).json({ status: "404", message: "user not found!" });
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
