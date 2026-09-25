const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    // ==========================================
    // Connect MongoDB
    // ==========================================

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // ==========================================
    // Get Admin Credentials
    // ==========================================

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env"
      );

      process.exit(1);
    }

    // ==========================================
    // Check Existing Admin
    // ==========================================

    const existingAdmin = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log(
          "Admin account already exists"
        );
      } else {
        existingAdmin.role = "admin";

        await existingAdmin.save();

        console.log(
          "Existing user promoted to admin successfully"
        );
      }

      await mongoose.connection.close();

      return;
    }

    // ==========================================
    // Hash Password
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==========================================
    // Create Admin
    // ==========================================

    const admin = await User.create({
      name: "CareerGuide Admin",
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      education: "",
      college: "",
      year: "",
      targetCareer: "",
    });

    console.log(
      "Admin created successfully"
    );

    console.log(
      `Admin Email: ${admin.email}`
    );

    console.log(
      "Admin Role:",
      admin.role
    );

    // ==========================================
    // Close Connection
    // ==========================================

    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed"
    );
  } catch (error) {
    console.error(
      "Failed to create admin:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();