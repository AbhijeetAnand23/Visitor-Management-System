const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.post("/", tokenVerification, async (req, res) => {
  try {
    const meetingId = req.body.meetingId;

    // console.log("Meeting ID:", meetingId);

    const deleteMeetingRequestQuery = `DELETE FROM meetingRequests WHERE id = ?`;
    const dbDeleteResult = await db.pool
      .promise()
      .execute(deleteMeetingRequestQuery, [meetingId]);

    console.log("Meeting Request Deleted:", dbDeleteResult);
    res.status(200).json({
      status: "success",
      message: "Meeting request deleted successfully",
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