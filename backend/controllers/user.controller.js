import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { refreshSessionModel } from "../models/refreshSession.model.js";
import { userServices } from "../services/user.services.js";
import { refreshSessionServices } from "../services/refreshSession.services.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/auth.cookie.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const userAlreadyExists = await userModel.findOne({ email });

    if (userAlreadyExists) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      const hashedPassword = await userModel.hashPassword(password);

      const user = await userServices.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
      });

      const accessToken = user.accessToken();
      const refreshToken = await refreshSessionServices.createRefreshSession({ user });

      setAccessTokenCookie(res, accessToken);
      setRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });
    }
  } catch (error) {
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

    const accessToken = user.accessToken();
    const refreshToken = await refreshSessionServices.createRefreshSession({ user });

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

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

export const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await refreshSessionServices.revokeRefreshSession({ jti: decoded.jti });
      } catch {
        // Ignore invalid/expired refresh tokens; cookies are still cleared.
      }
    }

    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

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

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const session = await refreshSessionModel.findOne({
      tokenHash: refreshSessionServices.hashRefreshToken(refreshToken),
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    if (session.revokedAt) {
      await refreshSessionServices.revokeRefreshFamily({ familyId: session.familyId });
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    if (session.expiresAt <= new Date()) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newRefreshToken = await refreshSessionServices.rotateRefreshSession({
      user,
      session,
      familyId: session.familyId,
    });

    if (!newRefreshToken) {
      await refreshSessionServices.revokeRefreshFamily({ familyId: session.familyId });
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const accessToken = user.accessToken();

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};
