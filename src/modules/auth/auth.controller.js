import { Router } from "express";
import { login, signup, signupWithGoogle } from "./auth.service.js";
import { successResponse } from "../../Common/response/successResponse.js";

import { badRequestException } from "../../Common/response/errorResponse.js";
import { validation } from "../../middleware/validate.middleware.js";
import { signupSchema } from "./auth.validation.js";
const authRouter=Router()

authRouter.post('/signup',validation(signupSchema),async (req,res)=>{
    const result= await signup(req.body)
    return successResponse(res, 201,result)
    }
)
authRouter.get('/login',async (req,res)=>{
    const result= await login(req.body)
    return successResponse(res, 201,result)
})

authRouter.post('/auth/signup/gmail',async (req,res)=>{
    const result= await signupWithGoogle(req.body)
    return successResponse(res, result.status,result)
})
export default authRouter