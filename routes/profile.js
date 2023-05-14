const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/follow_user").post(async (req, res) => {
  if (req.method != "POST") {
    return res.status(500).json({
      error_message: "Method not allowed!",
    });
  }
  try {
    const { userId, followersId } = req.query;
    const checkForExsistance = await prisma.Follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(userId),
          followingId: parseInt(followersId),
        },
      },
    }).then((r) => {
      if (r) {
        res.status(400).json({
          message: "User Already exists!",
          status: 400,
          userId: followersId,
        });
        return true;
      } else {
        return false;
      }
    });
    const data = await prisma.Follows.create({
      data: {
        followerId: parseInt(userId),
        followingId: parseInt(followersId),
      },
    })
      .then((r) => {
        console.log(r);
        if (r) {
          res.status(200).json({
            message: "User added to your followings",
            status: 200,
            userId: followersId,
          });
        } else {
          res.status(500).json({
            error: 500,
            error_message: "Error while getting users!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: 500,
          error_message: "Error while getting users:" + err,
        });
      });
  } catch (error) {
    console.log("error while getting users: ", error.message);
    res.status(500).json({
      error: 500,
      message: "Error while getting users:" + error,
    });
  }
});

module.exports = router;
