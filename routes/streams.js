const express = require("express");

const router = express.Router();
const prisma = require("../lib/prisma");

router.route("/create_stream").post((req, res) => {
  if (req.method != "POST") {
    return res.status(500).json({
      error_message: "Method not allowed!",
    });
  }
  const { name, description, liveId, userId } = req.query;
  try {
    const result = prisma.stream
      .create({
        data: {
          name: name,
          description: description,
          liveId: liveId,
          status: "live",
          user: {
            connect: {
              id: parseInt(userId),
            },
          },
        },
      })
      .then((r) => {
        console.log(r);
        res.status(200).json({
          message: "Stream Created!",
          status: 200,
          streamId: r.id,
          liveId: r.liveId,
          status: r.status,
          channelName: r.name,
          ownerId: r.userId,
        });
      })
      .catch((error) => {
        console.log("error while creating stream: ", error.message);
        res.status(500).json({
          error_message: "Error while creating stream!",
        });
      });
  } catch (error) {
    console.log("error while creating stream: ", error.message);
    res.status(500).json({
      error_message: "Error while creating stream!",
    });
  }
});

router.route("/update_stream").post((req, res) => {
  if (req.method != "POST") {
    return res.status(500).json({
      error_message: "Method not allowed!",
    });
  }
  const { status, streamId } = req.query;
  try {
    const result = prisma.stream
      .update({
        where: {
          id: parseInt(streamId),
        },
        data: {
          status: status,
        },
      })
      .then((r) => {
        console.log(r);
        res.status(200).json({
          message: "Stream updated!",
        });
      })
      .catch((error) => {
        console.log("error while updating stream: ", error.message);
        res.status(500).json({
          error_message: "Error while updating stream!",
        });
      });
  } catch (error) {
    console.log("error while updating stream: ", error.message);
    res.status(500).json({
      error_message: "Error while updating stream!",
    });
  }
});

router.route("/all_streams").get((req, res) => {
  try {
    const result = prisma.Stream.findMany({
      where: {
        status: "live",
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

router.route("/send_hearts").post(async (req, res) => {
  if (req.method != "POST") {
    return res.status(500).json({
      error_message: "Method not allowed!",
    });
  }
  const { userId, ownerId, hearts } = req.query;
  if (!userId || !ownerId || !hearts) {
    res.status(403).json({
      message: "Userid, ownerId, and hearts number is manadatory!",
    });
  }
  try {
    const user = await prisma.user
      .findUnique({
        where: {
          id: parseInt(userId),
        },
      })
      .then((r) => {
        if (r) {
          return r;
        } else {
          res.status(404).json({
            message: "user not found!",
          });
        }
      });
    const owner = await prisma.user
      .findUnique({
        where: {
          id: parseInt(ownerId),
        },
      })
      .then((r) => {
        if (r) {
          return r;
        } else {
          res.status(404).json({
            message: "owner not found!",
          });
        }
      });
    const setHeartsToOwner = owner.hearts + parseInt(hearts);
    const updateOwner = await prisma.user
      .update({
        where: {
          id: parseInt(ownerId),
        },
        data: {
          hearts: parseInt(setHeartsToOwner),
        },
      })
      .then((r) => {
        if (r) {
          return r;
        } else {
          res.status(404).json({
            message: "owner hearts failed",
          });
        }
      });
    const setHeartsToUser = user.hearts - hearts;
    const updateUser = await prisma.user
      .update({
        where: {
          id: parseInt(userId),
        },
        data: {
          hearts: parseInt(setHeartsToUser),
        },
      })
      .then((r) => {
        if (r) {
          return r;
        } else {
          res.status(404).json({
            message: "user hearts failed",
          });
        }
      });
    if (user && owner && updateOwner && updateUser) {
      res.status(200).json({
        message: "Updated user and owner of stream with heart: " + hearts,
      });
    } else {
      res.status(200).json({
        message:
          "Failed while updating user and owner of stream with heart: " +
          hearts,
      });
    }
  } catch (error) {
    console.log("error sending hearts: ", error.message);
    res.status(500).json({
      error_message: "Error while sending hearts!",
    });
  }
});

module.exports = router;
