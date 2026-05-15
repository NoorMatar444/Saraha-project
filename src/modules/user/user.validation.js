import joi from "joi";
import { commonFieldValidation, validateObjectIdFn } from "../../middleware/validate.middleware.js";

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
    .unknown(true)   
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

export const updatePasswordSchema={
  body:joi.object().keys({
    oldPassword:commonFieldValidation.password.required(),
    newPassword:commonFieldValidation.password.required(),
    confirmNewPassword:joi.string().valid(joi.ref('newPassword')).required()
  })
}