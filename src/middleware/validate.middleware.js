import joi from "joi";
import { badRequestException } from "../Common/response/errorResponse.js";
import { GenderEnums } from "./../Common/Enums/user.enums.js";
import { Types } from "mongoose";

export function validation(schema) {
  return (req, res, next) => {
    const validationErrors = [];

    for (const key of Object.keys(schema)) {
      const result = schema[key].validate(req[key], { abortEarly: false });
      req["validated" + key] = result.value;
      if (result.error) validationErrors.push(result.error);
    }

    if (validationErrors.length > 0) {
      const errors = validationErrors.flatMap((err) =>
        err.details.map((d) => ({ message: d.message, path: d.path })),
      );
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors,
      });
    }

    next();
  };
}

export const commonFieldValidation = {
  username: joi.string().length(4).trim(),
  email: joi.string().email().trim(),
  gender: joi
    .string()
    .valid(...Object.values(GenderEnums))
    .insensitive()
    .trim(),
  age: joi.number().min(12).max(100).positive(),
  colors: joi.array().items(joi.string().trim()),
  DOB: joi.date(),
  password: joi.string().min(1),
};

export function validateObjectIdFn(value, helpers) {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid object id");
  }
}
