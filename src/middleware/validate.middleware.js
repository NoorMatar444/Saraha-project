// src/middleware/validate.middleware.js
import joi from 'joi';
import { badRequestException } from "../Common/response/errorResponse.js";
import { GenderEnums } from './../Common/Enums/user.enums.js';

export function validation(schema) {
  return (req, res, next) => {
    const validationErrors = [];

    for (const schemaKey of Object.keys(schema)) {
      const validateResult = schema[schemaKey].validate(req[schemaKey], { abortEarly: false });
      req["validated" + schemaKey] = validateResult.value;

      if (validateResult.error?.details?.length > 0) {
        // collect structured error details so they can be returned/inspected later
        const details = validateResult.error.details.map((d) => ({
          message: d.message,
          path: d.path,
          type: d.type,
          context: d.context
        }));
        validationErrors.push({ key: schemaKey, details });
      }
    }

    if (validationErrors.length > 0) {
      // Throw a standard Error with cause that includes statusCode and details.
      // Your central error handler (fixed below) will read error.cause.statusCode.
      const err = new Error("validation error");
      err.cause = { statusCode: 400, details: validationErrors };
      throw err;
      // alternatively: badRequestException("validation error")  // this also throws but won't include details
    }

    next();
  };
}

export const commonFieldValidation = {
  username: joi.string().min(4).trim(),
  email: joi.string().email().trim(),
  gender: joi.string().valid(...Object.values(GenderEnums)).insensitive().trim(),
  age: joi.number().min(12).max(100).positive(),
  colors: joi.array().items(joi.string().trim()),
  DOB: joi.date(),
  password: joi.string().min(1)
};