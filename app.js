const express = require("express");
const app = express();

// Setting up config file
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "./config/config.env" });

app.use(express.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Import all routes

const auth = require("./routes/auth");

app.use("/api/v1", auth);

module.exports = app;
