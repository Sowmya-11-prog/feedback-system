// Run this once with `node seed.js` after your .env is configured
// to create a demo admin account and a demo student account.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const seed = async () => {
  await connectDB();

  const accounts = [
    { name: "Admin User", email: "admin@campus.edu", password: "Admin@123", role: "admin" },
    { name: "Demo Student", email: "student@campus.edu", password: "Student@123", role: "student" },
  ];

  for (const acc of accounts) {
    const existing = await User.findOne({ email: acc.email });
    if (existing) {
      console.log(`Skipped (already exists): ${acc.email}`);
      continue;
    }
    const hashedPassword = await bcrypt.hash(acc.password, 10);
    await User.create({ ...acc, password: hashedPassword });
    console.log(`Created ${acc.role}: ${acc.email} / ${acc.password}`);
  }

  await mongoose.disconnect();
  console.log("Seeding complete.");
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
