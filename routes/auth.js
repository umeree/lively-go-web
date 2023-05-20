const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

//Login User Api

router.route("/login_user").post((req, res) => {
  console.log("login_user api hit!");

  const { email, password } = req.body;

  try {
    const result = prisma.user
      .findFirst({
        where: {
          email,
          status: "active",
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

//Register User Api

router.route("/register_user").post((req, res) => {
  console.log("Register_user api hit!");

  const { first_name, last_name, email, password } = req.body;
  console.log(req.body);

  const date = new Date();

  try {
    const result = prisma.user
      .create({
        data: {
          email: email,
          password: password,
          user_name: first_name + date.getMilliseconds(),
          profile: {
            create: {
              first_name: first_name,
              last_name: last_name,
              phone_number: "2345",
            },
          },
        },
      })
      .then((query_res) => {
        if (query_res) {
          res.status(200).json({ message: "created!" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error while registering user: ", error.message);
    res.status(500).json({
      error: "Error while registering user!",
    });
  }
});

//Block user
router.route("/block_user").post(async (req, res) => {
  console.log("block_user api hit!");

  const { userId } = req.query;
  if (!userId) {
    console.log("UserId is required!");
    res.status(500).json({ error: 500, message: "User Id is required!" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (user) {
      const result = prisma.user
        .update({
          where: {
            id: parseInt(userId),
          },
          data: {
            status: user.status == "active" ? "block" : "active",
          },
        })
        .then((query_res) => {
          res.status(200).json({
            message: `user with userId ${userId} blocked!`,
            data: query_res,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log("error while blocking in user: ", error.message);
    res.status(500).json({
      error_message: "Error while blocking user!",
    });
  }
});

//User  Inforation Api

router.route("/userinformation").get((req, res) => {
  const { id } = req.query;
  console.log("User inormation api hit");
  try {
    const result = prisma.user
      .findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          profile: true,
          followers: {
            select: {
              follower: true,
            },
          },
          following: {
            select: {
              following: true,
            },
          },
          Stream: true,
        },
      })
      .then((query_res) => {
        if (query_res) {
          res.status(200).json({
            user: {
              status: "found",
              email: query_res.email,
              first_name: query_res.profile.first_name,
              last_name: query_res.profile.last_name,
              user_name: query_res.user_name,
              phone_number: query_res.profile.phone_number,
              role: query_res.profile.role,
              user_id: query_res.id,
              hearts: query_res.hearts,
            },
            followings: query_res.following,
            followers: query_res.followers,
            streams: query_res.Stream,
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
