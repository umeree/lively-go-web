const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/all_users").get((req, res) => {
  try {
    const result = prisma.profile
      .findMany({
        include: {
          user: {
            select: {
              id: true,
              user_name: true,
              email: true,
              status: true,
              hearts: true,
              _count: {
                select: {
                  Stream: true,
                },
              },
            },
          },
        },
      })
      .then((query_res) => {
        console.log(query_res);
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
    const result = prisma.user
      .findMany({
        where: {
          OR: [
            {
              user_name: {
                contains: user,
              },
            },
            {
              email: {
                contains: user,
              },
            },
          ],
          status: "active",
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

//** Get user information */
//User  Inforation Api

router.route("/get_enduser_information").get((req, res) => {
  const { id } = req.query;
  if (!id) {
    console.log("UserId is required!");
    res.status(404).json({ error: "Userid is requied!" });
  }
  try {
    const result = prisma.user
      .findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          profile: true,
          _count: {
            select: {
              Stream: true,
              followers: true,
              following: true,
            },
          },
        },
      })
      .then((query_res) => {
        if (query_res) {
          res.status(200).json({
            user: query_res,
          });
        } else {
          res.status(404).json({ "error:": "user data not found: " });
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ "error:": e });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "error:": error });
  }
});
module.exports = router;
