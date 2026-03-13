import joi from 'joi'
import { commonFieldValidation } from '../../middleware/validate.middleware.js'

export const signupSchema= {
    query:joi.object({}).keys({
        ln:joi.string().valid('en', 'ar')
    }),
    body:joi.object({}).keys({
        username:commonFieldValidation.username.required(),
        email:commonFieldValidation.email.required(),
        gender:commonFieldValidation.gender,
        age:commonFieldValidation.age,
        colors:commonFieldValidation.colors,
        DOB:commonFieldValidation.DOB,
        password:joi.string().min(1).required()
    })
}

