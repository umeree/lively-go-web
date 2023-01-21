const express = require("express");

const router = express.Router();

router.route("/login").get((req, res)=>{
    console.log("This is login route:", req);
    res.status(200).json({
        message: "This is login page",
    })
})

module.exports = router