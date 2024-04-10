const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const router = express.Router();

router.use(cors());
router.use(express.json());

const emailSender = "fcsonlineverify@gmail.com";
const emailPassword = "qxwhytfhrtkenzij";

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

async function sendOTPviaEmail(receiverEmail, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSender,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: emailSender,
    to: receiverEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
}

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email not provided" });
    }

    console.log("email: ", email);

    const otp = generateOTP();
    await sendOTPviaEmail(email, otp);
    return res.json({ otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
