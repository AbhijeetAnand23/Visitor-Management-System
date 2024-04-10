const express = require("express");
const router = express.Router();

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.get("/", tokenVerification, async (req, res) => {
  try {
    const receiverName = req.user.name;
    const getMeetingRequestsQuery = `
            SELECT * FROM meetingRequests WHERE receiverName = ?
        `;
    const [rows] = await db.pool
      .promise()
      .execute(getMeetingRequestsQuery, [receiverName]);

    res.status(200).json({
      status: "success",
      data: rows,
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
