const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function errorHandler(err, req, res, next) {
  if (err.name === "notFound") {
    res.status(404).json({ message: "Resource not found" });
  } else if (err.name === "SequelizeValidationError") {
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid token" });
  }  else if (err.name === "InvalidToken") {
    res.status(401).json({ message: "Invalid token" });
  } else if (err.name === "scheduleExist") {
    res.status(400).json({ message: "Schedule already exist" });
  }  else {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = errorHandler;
