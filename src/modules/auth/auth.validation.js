import joi from 'joi'
import { commonFieldValidation } from '../../middleware/validate.middleware.js'

export const signupSchema= {
    query:joi.object({}).keys({
        ln:joi.string().valid('en', 'ar')
    }),
    body:joi.object({}).keys({
        username:commonFieldValidation.username.required(),
        email:joi.string().trim().required(),
        gender:commonFieldValidation.gender,
        age:commonFieldValidation.age,
        colors:commonFieldValidation.colors,
        DOB:commonFieldValidation.DOB,
        password:joi.string().min(1).required()
    })
}

export const confirmEmailSchema={
    body:joi.object({}).keys({
        email : commonFieldValidation.email.required(),
        OTP : commonFieldValidation.OTP.required()
    })
}

export const resendOtpConfirmEmailSchema={
    body:joi.object({}).keys({
        email : commonFieldValidation.email.required(),
    })
}

export const sendOtpForgetPasswordSchema={
     body:joi.object({}).keys({
        email : commonFieldValidation.email.required(),
    })
}

export const verifyOtpForgetPasswordSchema={
    body:joi.object({}).keys({
        email : commonFieldValidation.email.required(),
        OTP : commonFieldValidation.OTP.required()
    })
}

export const resetPasswordSchema={
    body:joi.object({}).keys({
        email : commonFieldValidation.email.required(),
        OTP : commonFieldValidation.OTP.required(),
        Password: commonFieldValidation.password.required()
    })
}

export const resendForgetPasswordOtpSchema={
    body:joi.object({}).keys({
        email : commonFieldValidation.email.required(),
    })
}