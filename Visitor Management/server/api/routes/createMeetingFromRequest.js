const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.post("/", tokenVerification, async (req, res) => {
  try {
    const hostID = req.user.id;
    const hostName = req.user.name;
    const status = req.body.status;
    const meetingDate = req.body.date;
    const meetingTime = req.body.time;
    const meetingLocation = req.body.location;
    const meetingDescription = req.body.meetingDescription;
    const attendantID = req.body.attendantID;
    const attendantName = req.body.attendantName;
    const meetingId = req.body.meetingId;

    const insertQuery = `
            INSERT INTO Meetings (Host, Attendant, Status, MeetingDate, MeetingTime, MeetingLocation, MeetingDescription, AttendantName, HostName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const dbInsertResult = await db.pool
      .promise()
      .execute(insertQuery, [
        hostID,
        attendantID,
        status,
        meetingDate,
        meetingTime,
        meetingLocation,
        meetingDescription,
        attendantName,
        hostName,
      ]);

    const deleteMeetingRequestQuery = `DELETE FROM meetingRequests WHERE id = ?`;
    const dbDeleteResult = await db.pool
      .promise()
      .execute(deleteMeetingRequestQuery, [meetingId]);

    console.log("Meeting Created:", dbInsertResult);
    // console.log("Meeting Request Deleted:", dbDeleteResult);
    res.status(200).json({
      status: "success",
      message: "Meeting Created",
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