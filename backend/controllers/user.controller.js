import { userModel } from "../models/user.model.js";
import { userServices } from "../services/user.services.js";
import { setAuthCookie } from "../utils/auth.cookie.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userServices.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();

    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    console.error("Error registering user:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error login user:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
