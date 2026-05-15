import joi from "joi";
import { commonFieldValidation } from './../../middleware/validate.middleware.js';

export const sendMessageSchema = {
  body: joi.object({}).keys({
    content: joi.string().min(1).max(1000),
  }),
  params: joi.object().keys({
    receiverId: commonFieldValidation.id.required(),
  })
};


export const sendMessageByIdSchema = {
  params: joi.object().keys({
    messageId: commonFieldValidation.id.required(),
  })
};