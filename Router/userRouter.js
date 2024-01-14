const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
require("dotenv").config();
const { userModel } = require("../models/userModel");

// Ensure that you have established the MongoDB connection properly before using these routes.

userRouter.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ "msg": error.message });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.send({ "msg": "User is already registered" });
    }

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({ name, email, password: hash });

    // Save the user to the database
    await newUser.save();

    res.send({ "msg": "User is registered successfully" });
  } catch (error) {
    res.status(500).send({ "msg": error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.send({ "msg": "Wrong credentials" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate a JWT token for authentication
      const token = jwt.sign({ userId: user._id }, process.env.KEY, { expiresIn: "3600s" });

      res.send({ "msg": "Logged In", "token": token, "result": user._id });
    } else {
      res.send({ "msg": "Wrong credentials" });
    }
  } catch (error) {
    res.status(500).send({ "msg": "Unable to log in", "error": error.message });
  }
});

module.exports = {
  userRouter
};
