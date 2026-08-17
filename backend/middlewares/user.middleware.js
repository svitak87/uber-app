import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    let message = ""
     result.errors.map((err) => (
       message = err.msg
    ))
    return res.status(400).json({
      errors: message
    });
  }

  next();
};