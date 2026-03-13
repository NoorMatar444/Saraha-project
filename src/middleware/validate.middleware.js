
import joi from 'joi'
import { badRequestException } from "../Common/response/errorResponse.js";
import { GenderEnums } from './../Common/Enums/user.enums.js';

export function validation(schema) {
  return (req, res, next) => {
    const validationErrors=[]
    for (const schemaKey of Object.keys(schema)) {
      const validateResult = schema[schemaKey].validate(req[schemaKey], {
      abortEarly: false,
    });
      req["validated"+schemaKey]=validateResult.value

       if (validateResult.error?.details.length > 0) {
      return validationErrors.push(validateResult.error);
    }
    }
    

    if( validationErrors.length > 0){
        return badRequestException("validation error", validationErrors);
    }
   
    next()
  };
  
}

export const commonFieldValidation={
  username:joi.string().length(4).trim(),
          email:joi.string().email().trim(),
          gender:joi.string().valid(...Object.values(GenderEnums)).insensitive().trim(),
          age:joi.number().min(12).max(100).positive(),
          colors:joi.array().items(joi.string().trim()),
          DOB:joi.date(),
          password:joi.string().min(1)
}