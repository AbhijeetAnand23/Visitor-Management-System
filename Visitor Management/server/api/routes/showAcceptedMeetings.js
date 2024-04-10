const express = require("express");
const router = express.Router();

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.get("/", tokenVerification, async (req, res) => {
  try {
    const hostId = req.user.id;

    const selectQuery = `
        SELECT * FROM meetings
        WHERE (Host = ? OR Attendant = ?) AND status = 'accepted'
    `;
    
    const [meetings] = await db.pool.promise().execute(selectQuery, [hostId, hostId]);
    res.status(200).json({
      status: "success",
      data: meetings,
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
