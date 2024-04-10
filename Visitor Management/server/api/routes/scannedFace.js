const express = require("express");
const router = express.Router();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config();

const db = require("../../database/db");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(2);

    let daySuffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = "st";
    } else if (day === 2 || day === 22) {
      daySuffix = "nd";
    } else if (day === 3 || day === 23) {
      daySuffix = "rd";
    }

    return `${day}${daySuffix} ${month} '${year}`;
};


const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12;
  const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
  const formattedTime = formattedHours + ':' + formattedMinutes + ' ' + period;

  return formattedTime;
};


router.post("/", async (req, res) => {
  try {
    const io = req.io;
    const userScannedFace = req.body.scannedFace;
    console.log("Scanned Face:", userScannedFace);

    const userIdQuery = "SELECT UserID FROM Users WHERE Username = ?";
    const [userIdRows] = await db.pool
      .promise()
      .execute(userIdQuery, [userScannedFace]);
    console.log("User ID:", userIdRows);

    if (userIdRows.length > 0) {
      // Check if the user is a visitor or student
      const userTypeQuery = "SELECT UserType FROM Users WHERE Username = ?";
      const [userTypeRows] = await db.pool.promise().execute(userTypeQuery, [userScannedFace]);

      if (userTypeRows.length > 0) {
        const userType = userTypeRows[0].UserType;
        if (userType === 'visitor') {
          // Execute visitor queries
          const userData = await getVisitorData(userScannedFace, userIdRows[0].UserID);
          io.emit("newEntry", { data: userData });
          res.status(200).json({
            status: "success",
            message: "User found",
            type: "newEntry",
            data: userData,
          });
        } else if (userType === 'student') {
          // Execute student queries
          const userData = await getStudentData(userScannedFace, userIdRows[0].UserID);
          io.emit("newEntry", { data: userData });
          res.status(200).json({
            status: "success",
            message: "User found",
            type: "newEntry",
            data: userData,
          });
        } else {
          // Handle other user types if needed
          res.status(400).json({
            status: "error",
            message: "Unsupported user type",
          });
        }
      } else {
        res.status(404).json({
          status: "error",
          message: "User type not found",
        });
      }
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});


async function getVisitorData(userScannedFace, userId) {
  // Query for visitor data
  const nameQuery = "SELECT Name FROM Users WHERE Username = ?";
  const emailQuery = "SELECT Email FROM Users WHERE Username = ?";
  const imageQuery = "SELECT Image FROM Users WHERE Username = ?";
  const professionQuery = "SELECT Profession FROM visitors WHERE UserID = ?";
  const addressQuery = "SELECT Address FROM visitors WHERE UserID = ?";
  const ageQuery = "SELECT Age FROM visitors WHERE UserID = ?";
  const meetingDateQuery = "SELECT MeetingDate FROM meetings WHERE Attendant = ?";
  const meetingTimeQuery = "SELECT MeetingTime FROM meetings WHERE Attendant = ?";
  const meetingLocationQuery = "SELECT MeetingLocation FROM meetings WHERE Attendant = ?";
  const meetingDescriptionQuery = "SELECT MeetingDescription FROM meetings WHERE Attendant = ?";
  const userTypeQuery = "SELECT UserType FROM Users WHERE Username = ?";

  const [userTypeRows] = await db.pool.promise().execute(userTypeQuery, [userScannedFace]);
  const [nameRows] = await db.pool.promise().execute(nameQuery, [userScannedFace]);
  const [emailRows] = await db.pool.promise().execute(emailQuery, [userScannedFace]);
  const [professionRows] = await db.pool.promise().execute(professionQuery, [userId]);
  const [addressRows] = await db.pool.promise().execute(addressQuery, [userId]);
  const [ageRows] = await db.pool.promise().execute(ageQuery, [userId]);
  const [meetingDateRows] = await db.pool.promise().execute(meetingDateQuery, [userId]);
  const [meetingTimeRows] = await db.pool.promise().execute(meetingTimeQuery, [userId]);
  const [meetingLocationRows] = await db.pool.promise().execute(meetingLocationQuery, [userId]);
  const [meetingDescriptionRows] = await db.pool.promise().execute(meetingDescriptionQuery, [userId]);
  const [imageRows] = await db.pool.promise().execute(imageQuery, [userScannedFace]);

  const imageUrls = await Promise.all(imageRows.map((row) => getImageUrl(row.Image)));

  const userData = nameRows.map((nameRow, index) => ({
    Name: nameRow.Name,
    Email: emailRows[index].Email,
    Age: ageRows[index].Age,
    'User Type': capitalizeFirstLetter(userTypeRows[index].UserType),
    ImageUrl: imageUrls[index],
    Profession: professionRows[index].Profession,
    'Meeting Description': meetingDescriptionRows[index].MeetingDescription,
    Address: addressRows[index].Address,
    'Meeting Date': formatDate(meetingDateRows[index].MeetingDate),
    'Meeting Time': formatTime(meetingTimeRows[index].MeetingTime),
    'Meeting Location': meetingLocationRows[index].MeetingLocation,
  }));

  return userData;
}


async function getStudentData(userScannedFace, userId) {
  // Query for student data
  const nameQuery = "SELECT Name FROM Users WHERE Username = ?";
  const emailQuery = "SELECT Email FROM Users WHERE Username = ?";
  const imageQuery = "SELECT Image FROM Users WHERE Username = ?";
  const rollNumberQuery = "SELECT RollNumber FROM Students WHERE UserID = ?";
  const branchQuery = "SELECT BranchOfStudy FROM Students WHERE UserID = ?";
  const yearQuery = "SELECT YearOfStudy FROM Students WHERE UserID = ?";
  // const meetingDateQuery = "SELECT MeetingDate FROM meetings WHERE Attendant = ?";
  // const meetingTimeQuery = "SELECT MeetingTime FROM meetings WHERE Attendant = ?";
  // const meetingLocationQuery = "SELECT MeetingLocation FROM meetings WHERE Attendant = ?";
  // const meetingDescriptionQuery = "SELECT MeetingDescription FROM meetings WHERE Attendant = ?";
  const userTypeQuery = "SELECT UserType FROM Users WHERE Username = ?";
  
  const [userTypeRows] = await db.pool.promise().execute(userTypeQuery, [userScannedFace]);
  const [nameRows] = await db.pool.promise().execute(nameQuery, [userScannedFace]);
  const [emailRows] = await db.pool.promise().execute(emailQuery, [userScannedFace]);
  const [rollNumberRows] = await db.pool.promise().execute(rollNumberQuery, [userId]);
  const [branchRows] = await db.pool.promise().execute(branchQuery, [userId]);
  const [yearRows] = await db.pool.promise().execute(yearQuery, [userId]);
  // const [meetingDateRows] = await db.pool.promise().execute(meetingDateQuery, [userId]);
  // const [meetingTimeRows] = await db.pool.promise().execute(meetingTimeQuery, [userId]);
  // const [meetingLocationRows] = await db.pool.promise().execute(meetingLocationQuery, [userId]);
  // const [meetingDescriptionRows] = await db.pool.promise().execute(meetingDescriptionQuery, [userId]);
  const [imageRows] = await db.pool.promise().execute(imageQuery, [userScannedFace]);

  const imageUrls = await Promise.all(imageRows.map((row) => getImageUrl(row.Image)));

  const userData = nameRows.map((nameRow, index) => ({
    Name: nameRow.Name,
    Email: emailRows[index].Email,
    'User Type': capitalizeFirstLetter(userTypeRows[index].UserType),
    ImageUrl: imageUrls[index],
    'Roll Number': rollNumberRows[index].RollNumber,
    'Branch': branchRows[index].BranchOfStudy,
    'Year': yearRows[index].YearOfStudy,
    // 'Meeting Date': meetingDateRows[index].MeetingDate,
    // 'Meeting Time': meetingTimeRows[index].MeetingTime,
    // 'Meeting Location': meetingLocationRows[index].MeetingLocation,
    // 'Meeting Description': meetingDescriptionRows[index].MeetingDescription,
  }));

  return userData;
}


async function getImageUrl(imageKey) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: imageKey,
  };

  try {
    const command = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
  }
}

module.exports = router;