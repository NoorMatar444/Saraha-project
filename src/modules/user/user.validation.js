import joi from "joi";
import { validateObjectIdFn } from "../../middleware/validate.middleware.js";

export const profilePicSchema = {
  file: joi
    .object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().required(),
    })
    .required(),
};

export const coverPicSchema = {
  files: joi
    .array()
    .items(
      joi
        .object({
          fieldname: joi.string().required(),
          originalname: joi.string().required(), 
          encoding: joi.string().required(),
          mimetype: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
        .required(),
    )
    .required(),
};

export const getAnotherUserProfileSchema={
  params:joi.object().keys({
    profileId:joi.string().custom(validateObjectIdFn).required()
  }).required()
}