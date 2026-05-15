import { Router } from "express";
import { confirmEmail, login, resendConfirmEmailOtp, signup, signupWithGoogle } from "./auth.service.js";
import { successResponse } from "../../Common/response/successResponse.js";
import { badRequestException } from "../../Common/response/errorResponse.js";
import { validation } from "../../middleware/validate.middleware.js";
import { confirmEmailSchema, resendOtpConfirmEmailSchema, resetPasswordSchema, sendOtpForgetPasswordSchema, signupSchema, verifyOtpForgetPasswordSchema } from "./auth.validation.js";
import {localUpload,allowFileFormat} from "../../Common/Multer/multer.config.js";

const authRouter=Router()

authRouter.post('/signup',validation(signupSchema),async (req,res)=>{
    const result= await signup(req.body)
    return successResponse(res, 201)
    }
)
authRouter.get('/login',async (req,res)=>{
    const result= await login(req.body)
    return successResponse(res, 201,result)
})

authRouter.post('/signup/gmail',async (req,res)=>{
    const result= await signupWithGoogle(req.body)
    return successResponse(res, result.status,result)
})
authRouter.post('/confirm-email',validation(confirmEmailSchema),async (req,res)=>{
    const result= await confirmEmail(req.body)
    return successResponse(res, 201,result)
    }
)

authRouter.post('/resend-otp-confirm-email',validation(resendOtpConfirmEmailSchema),async (req,res)=>{
    const result= await resendConfirmEmailOtp(req.body.email)
    return successResponse(res, 201,result)
    }
)

authRouter.post('/resend-otp-forget-password',validation(sendOtpForgetPasswordSchema),async (req,res)=>{
    const result= await sendOtpForgetPassword(req.body.email)
    return successResponse(res, 201,result)
    }
)

authRouter.post('/resend-forget-password-otp',validation(sendOtpForgetPasswordSchema),async (req,res)=>{
    const result= await resendForgetPasswordOtp(req.body.email)
    return successResponse(res, 201,result)
    }
)

authRouter.post('/verify-otp-forget-password',validation(verifyOtpForgetPasswordSchema),async (req,res)=>{
    const result= await verifyOtpForgetPassword(req.body.email)
    return successResponse(res, 201,result)
    }
)

authRouter.post('/reset-password',validation(resetPasswordSchema),async (req,res)=>{
    const result= await resetPassword(req.body.email)
    return successResponse(res, 201,result)
    }
)

export default authRouter