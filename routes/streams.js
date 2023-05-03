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
module.exports = router;
