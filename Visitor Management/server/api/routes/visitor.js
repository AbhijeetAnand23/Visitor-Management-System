const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.post("/", tokenVerification, async (req, res) => {
  try {
    const userID = req.user.id;
    const profession = req.body.profession;
    const address = req.body.address;
    const age = req.body.age;

    const insertQuery = `INSERT INTO Visitors (UserID, Profession, Address, Age) VALUES (?, ?, ?, ?)`;
    const dbInsertResult = await db.pool
      .promise()
      .execute(insertQuery, [userID, profession, address, age]);

    console.log("Values Inserted:", dbInsertResult);
    res.status(200).json({
      status: "success",
      message: "Values Inserted",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
