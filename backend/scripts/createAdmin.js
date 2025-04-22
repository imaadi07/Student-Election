const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async (email, password) => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/student-election", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("Admin already exists.");
      return;
    }

    // Create admin
    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role: "admin",
    });
    await user.save();
    console.log(`Admin ${email} created successfully.`);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run with: node scripts/createAdmin.js
createAdmin("admin@jietjodhpur.ac.in", "12345678");
