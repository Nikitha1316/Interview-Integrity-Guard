const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/send-email", async (req, res) => {
  const { email, meetingLink } = req.body;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Zoom Interview Link",
    text: `Your interview is scheduled. Click the link to join: ${meetingLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
