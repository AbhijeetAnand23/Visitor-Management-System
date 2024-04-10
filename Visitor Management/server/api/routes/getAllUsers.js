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

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM Users";
    const [rows, fields] = await db.pool.promise().execute(query);

    for (let i = 0; i < rows.length; i++) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: rows[i].Image,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
      rows[i].ImageUrl = url;
    }

    res.status(200).json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

module.exports = router;
