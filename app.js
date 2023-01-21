const express = require("express");
const app = express();


// Setting up config file
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "./config/config.env" });


app.use(express.json());

// Import all routes

const auth = require("./routes/auth");

app.use("/api/v1", auth);

module.exports = app;