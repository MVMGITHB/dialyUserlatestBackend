import User from "../models/User.js";
import sendEmail from "../middleware/sendEmail.js";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const verificationToken = crypto.randomBytes(32).toString("hex");    

    const user = new User({ name, email, phone, password,verificationToken });
    await user.save();

    // Send welcome email
     await sendVerificationEmail(email,verificationToken);

    res.status(201).json({ success: true, message: "User registered", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Login


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    // Check credentials (you’re not hashing passwords, so compare directly)
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = { id: user._id, email: user.email };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // token expires in 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // send token to frontend
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Logout
export const logoutUser = async (req, res) => {
  try {
    // Since no JWT/session, just return response
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // res.status(200).json({ message: "Email verified successfully" });
    return res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};