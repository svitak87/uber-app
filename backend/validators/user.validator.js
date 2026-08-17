import { body } from "express-validator";

export const registerValidator = [
  body("fullname.firstname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .notEmpty(),

  body("fullname.lastname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long")
    .notEmpty(),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email")
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .notEmpty(),
];

export const loginValidator = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email")
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .notEmpty(),
];
