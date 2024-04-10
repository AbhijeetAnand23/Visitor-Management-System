// student.js
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
    const branchOfStudy = req.body.branchOfStudy;
    const yearOfStudy = req.body.yearOfStudy;
    const address = req.body.address;
    const rollNumber = req.body.rollNumber;

    const insertQuery = `INSERT INTO Students (UserID, BranchOfStudy, YearOfStudy, Address, rollNumber) VALUES (?, ?, ?, ?,?)`;
    const dbInsertResult = await db.pool
      .promise()
      .execute(insertQuery, [userID, branchOfStudy, yearOfStudy, address,rollNumber]);

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
