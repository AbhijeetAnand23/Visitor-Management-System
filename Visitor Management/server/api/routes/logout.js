const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post("/", (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ status: "success", message: "Logged out successfully" });
});

module.exports = router;