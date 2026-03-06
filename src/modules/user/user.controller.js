

import { Router } from "express";
import { renewToken } from "./user.service.js";
import { successResponse } from './../../Common/response/successResponse.js';
import { authentication } from './../../middleware/authentication.middleware.js';
import { TokenType } from "../../Common/Enums/token.enums.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { RoleEnums } from "../../Common/Enums/user.enums.js";


const userRouter=Router()

userRouter.get("/user",authentication(), authorization(),async(req,res)=>{
    return successResponse(res, 201,req.user)
})


userRouter.post("/renewToken",authentication(TokenType.refresh),async(req,res)=>{
    const data=await renewToken(req.user);
    return successResponse(res, 201,data)
})
export default userRouter;