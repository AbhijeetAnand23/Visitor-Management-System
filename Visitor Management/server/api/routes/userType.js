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

// Middleware
const tokenVerification = require("../../middleware/verify");

router.get("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    const name = req.user.name;
    const emailQuery = "SELECT Email FROM Users WHERE UserID = ?";
    const [emailRows] = await db.pool.promise().execute(emailQuery, [userId]);
    // console.log("Email Rows:", emailRows);
    const imageQuery = "SELECT Image FROM Users WHERE UserID = ?";
    const [imageRows] = await db.pool.promise().execute(imageQuery, [userId]);

    const imageUrl = await getImageUrl(imageRows[0].Image);

    res.status(200).json({
      status: "success",
      data: {
        userType: userType,
        name: name,
        email: emailRows[0].Email,
        imageUrl: imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

async function getImageUrl(imageKey) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: imageKey,
  };

  try {
    const command = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 360000 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
  }
}

module.exports = router;
