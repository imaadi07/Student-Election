const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate email format for students
    const emailRegex = /^[a-zA-Z0-9_]+\.jics[0-9]+@jietjodhpur\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        msg: "Invalid email. Must be in the format name.jicsXXX@jietjodhpur.ac.in (e.g., aditya.jics054@jietjodhpur.ac.in)",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Create student user (role is always 'student')
    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role: "student",
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate email format for students (admins may have different emails)
    const emailRegex = /^[a-zA-Z0-9_]+\.jics[0-9]+@jietjodhpur\.ac\.in$/;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (user.role === "student" && !emailRegex.test(email)) {
      return res.status(400).json({
        msg: "Invalid email. Students must use name.jicsXXX@jietjodhpur.ac.in format",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
