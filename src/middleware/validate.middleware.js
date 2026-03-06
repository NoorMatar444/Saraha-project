import { badRequestException } from "../Common/response/errorResponse.js";
import { signupSchema } from "../modules/auth/auth.validation.js";

export function validation(schema) {
  return (req, res, next) => {
    const validationErrors=[]
    for (const schemaKey of Object.keys(schema)) {
      const validateResult = schema[schemaKey].validate(req[schemaKey], {
      abortEarly: false,
    });
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
