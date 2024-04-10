const express = require("express");
const router = express.Router();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const db = require("../../database/db");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

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

// multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
upload.single("image");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const image = req.file;
    const userType = req.body.userType;

    const checkEmailQuery = "SELECT * FROM Users WHERE Email = ?";
    const [existingUsers, _] = await db.pool
      .promise()
      .execute(checkEmailQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists. Please choose a different email.",
      });
    }

    const checkUsernameQuery = "SELECT * FROM Users WHERE Username = ?";
    const [existingUsernames, __] = await db.pool
      .promise()
      .execute(checkUsernameQuery, [username]);

    if (existingUsernames.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists. Please choose a different username.",
      });
    }

    const imageName = randomImageName();

    // Hash the password using crypto module
    const hashedPassword = crypto
      .createHash("sha256") 
      .update(password)
      .digest("hex");

    const insertQuery = `
            INSERT INTO Users (Name, Email, Password, Image, UserType, Username) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const dbInsertResult = await db.pool
      .promise()
      .execute(insertQuery, [
        name,
        email,
        hashedPassword,
        imageName,
        userType,
        username,
      ]);

    console.log("Values Inserted:", dbInsertResult);
    res.status(200).json({
      status: "success",
      message: "Values Inserted",
    });

    // S3 upload
    const s3Params = {
      Bucket: bucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      const s3Command = new PutObjectCommand(s3Params);
      await s3.send(s3Command);
      console.log("File uploaded to S3 successfully");
    } catch (s3Error) {
      console.error("Error uploading file to S3:", s3Error);
      res.status(500).json({
        status: "error",
        message: "Error uploading file to S3",
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

module.exports = router;
