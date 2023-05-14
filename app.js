const express = require("express");
var morgan = require("morgan");
const app = express();
app.use(morgan("combined"));

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
const users = require("./routes/users");
const profile = require("./routes/profile");
const streams = require("./routes/streams");
const payments = require("./routes/payments");

app.use("/api/v1", auth);
app.use("/api/v1", users);
app.use("/api/v1", profile);
app.use("/api/v1", streams);
app.use("/api/v1", payments);

module.exports = app;
