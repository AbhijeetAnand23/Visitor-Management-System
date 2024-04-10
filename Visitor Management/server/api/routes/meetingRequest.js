const express = require("express");
const router = express.Router();

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.post("/", tokenVerification, async (req, res) => {
  try {
    const senderId = req.user.id;
    const senderName = req.user.name;
    const receiverName = req.body.receiverName;
    const userType = req.user.userType;
    const meetingDescription = req.body.meetingDescription;

    const insertQuery = `
      INSERT INTO meetingRequests (senderId, senderName, receiverName, meetingDescription, userType)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.pool
      .promise()
      .execute(insertQuery, [
        senderId,
        senderName,
        receiverName,
        meetingDescription,
        userType,
      ]);

    res.status(200).json({
      status: "success",
      message: "Meeting request created",
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
