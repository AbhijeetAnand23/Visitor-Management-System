const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const db = require('../../database/db');

// Middleware
const tokenVerification = require('../../middleware/verify');

router.post("/", tokenVerification, async (req, res) => {
    try {
        const userID = req.user.id;
        const academicTitle = req.body.academicTitle;
        const department = req.body.department;
        const officeLocation = req.body.officeLocation;
        const officeHoursStart = req.body.officeHoursStart;
        const officeHoursEnd = req.body.officeHoursEnd;

        console.log("User ID:", userID);
        console.log("Academic Title:", academicTitle);
        console.log("Department:", department);
        console.log("Office Location:", officeLocation);
        console.log("Office Hours Start:", officeHoursStart);
        console.log("Office Hours End:", officeHoursEnd);

        const insertQuery = `
            INSERT INTO Faculty (UserID, AcademicTitle, Department, OfficeLocation, OfficeHoursStart, OfficeHoursEnd) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const dbInsertResult = await db.pool.promise().execute(insertQuery, [userID, academicTitle, department, officeLocation, officeHoursStart, officeHoursEnd]);

        console.log("Values Inserted:", dbInsertResult);
        res.status(200).json({
            status: "success",
            message: "Values Inserted",
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