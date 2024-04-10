const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

router.use(express.json());
router.use(cookieParser());

const db = require("../../database/db");

router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const query = "SELECT * FROM Users WHERE Username = ?";
    const [rows, fields] = await db.pool.promise().execute(query, [username]);

    if (rows.length === 0) {
      res
        .status(401)
        .json({ status: "error", message: "Invalid username or password" });
      return;
    }

    const user = rows[0];
    // console.log("User:", user);
    const storedPasswordHash = user.Password; // Assuming the stored password hash is already in the correct format

    // Perform password comparison using crypto library
    const enteredPasswordHash = crypto
      .createHash("sha256") // Use the same algorithm used during signup
      .update(password)
      .digest("hex");

    if (storedPasswordHash !== enteredPasswordHash) {
      res
        .status(401)
        .json({ status: "error", message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.UserID,
        username: user.Username,
        name: user.Name,
        userType: user.UserType,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({ status: "success", token: token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

module.exports = router;
