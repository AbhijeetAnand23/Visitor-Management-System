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
    const hostID = req.user.id;
    const attendantName = req.body.attendantName;
    const status = req.body.status;
    const meetingDate = req.body.meetingDate;
    const meetingTime = req.body.meetingTime;
    const meetingLocation = req.body.meetingLocation;
    const meetingDescription = req.body.meetingDescription;
    const hostName = req.user.name;
    const getAttendantIDQuery = `SELECT UserID FROM Users WHERE Name = ?`;
    const dbGetAttendantIDResult = await db.pool
      .promise()
      .execute(getAttendantIDQuery, [attendantName]);
    const attendantID = dbGetAttendantIDResult[0][0].UserID;

    const insertQuery = `
            INSERT INTO Meetings (Host, Attendant, Status, MeetingDate, MeetingTime, MeetingLocation, MeetingDescription, AttendantName, HostName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

    console.log("Attendant ID:", attendantID);
    console.log("Insert Query:", insertQuery);

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
        hostName
      ]);

    console.log("Meeting Created:", dbInsertResult);
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
