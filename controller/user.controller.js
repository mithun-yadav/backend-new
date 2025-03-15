import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.json({ message: "User register successfully!", newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Password" });
    }

    // Get tokens from your token creation function
    const { accessToken } = await createTokenAndSaveCookie(res, user._id);
    res
      .status(201)
      .json({ message: "User logedin successfully!", user, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logout successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // const allUsers = await User.find().select("-password");
    const loggedInUser = req.user._id;
    console.log(loggedInUser, "+++++");
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    console.log(filteredUsers, "logedIN+++++");
    // Explicitly convert to JSON to ensure proper serialization
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in allUsers controller:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
