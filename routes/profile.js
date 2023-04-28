const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/follow_user").post((req, res) => {
  if (req.method != "POST") {
    return res.status(500).json({
      error_message: "Method not allowed!",
    });
  }
  try {
    const { userId, followersId } = req.query;
    const result = prisma.user
      .update({
        where: {
          id: parseInt(userId),
        },
        data: {
          Followings: {
            create: {
              followingId: parseInt(followersId),
            },
          },
        },
      })
      .then((r) => {
        const result2 = prisma.user
          .update({
            where: {
              id: parseInt(followersId),
            },
            data: {
              Followers: {
                create: {
                  followersId: parseInt(followersId),
                },
              },
            },
          })
          .then((r) => {
            res.status(200).json({
              message: "User added to your followings",
              status: 200,
              userId: followersId,
            });
          });
      });
  } catch (error) {
    console.log("error while getting users: ", error.message);
    res.status(500).json({
      error_message: "Error while getting users!",
    });
  }
});

module.exports = router;
