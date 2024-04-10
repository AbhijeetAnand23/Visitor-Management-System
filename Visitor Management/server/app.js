const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket.IO connection established");
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ------------------- ROUTES -------------------
const signUpRoute = require("./api/routes/signup");
const loginRoute = require("./api/routes/login");
const logoutRoute = require("./api/routes/logout");
const getUserTypeRoute = require("./api/routes/userType");
const studentRoute = require("./api/routes/student");
const facultyRoute = require("./api/routes/faculty");
const visitorRoute = require("./api/routes/visitor");
const meetingRoute = require("./api/routes/meeting");
const getUsersRoute = require("./api/routes/getAllUsers");
const meetingRequestsRoute = require("./api/routes/meetingRequest");
const getMeetingRequestsRoute = require("./api/routes/getMeetingRequests");
const createMeetingFromRequestRoute = require("./api/routes/createMeetingFromRequest");
const showAcceptedMeetingsRoute = require("./api/routes/showAcceptedMeetings");
const scannedFaceRoute = require("./api/routes/scannedFace");
const otpRoute = require("./api/routes/OtpGeneration");
const deleteMeetingFromRequest = require("./api/routes/deleteMeetingFromRequest");

app.use("/signup", signUpRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/userType", getUserTypeRoute);
app.use("/student", studentRoute);
app.use("/faculty", facultyRoute);
app.use("/visitor", visitorRoute);
app.use("/meeting", meetingRoute);
app.use("/getUsers", getUsersRoute);
app.use("/meetingRequests", meetingRequestsRoute);
app.use("/meetingRequests", getMeetingRequestsRoute);
app.use("/createMeetingFromRequest", createMeetingFromRequestRoute);
app.use("/showAcceptedMeetings", showAcceptedMeetingsRoute);
app.use("/otp", otpRoute);
app.use("/scannedFace", scannedFaceRoute);
app.use("/deleteMeetingFromRequest", deleteMeetingFromRequest);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = { server, io };