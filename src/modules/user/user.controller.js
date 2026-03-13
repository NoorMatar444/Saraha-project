import { Router } from "express";
import { renewToken, uploadProfilePic } from "./user.service.js";
import { successResponse } from "./../../Common/response/successResponse.js";
import { authentication } from "./../../middleware/authentication.middleware.js";
import { TokenType } from "../../Common/Enums/token.enums.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { RoleEnums } from "../../Common/Enums/user.enums.js";
import { validation } from './../../middleware/validate.middleware.js';
import { allowFileFormat, localUpload } from "../../Common/Multer/multer.config.js";
import { profilePicSchema } from "./user.validation.js";


const userRouter = Router();

userRouter.get("/user", authentication(), authorization(), async (req, res) => {
  return successResponse(res, 201, req.user);
});

userRouter.post(
  "/renewToken",
  authentication(TokenType.refresh),
  async (req, res) => {
    const data = await renewToken(req.user);
    return successResponse(res, 201, data);
  },
);

userRouter.post(
  "/upload-pic",
  authentication(),
  localUpload({
    folderName: "users",
    allowedFormat: allowFileFormat.img,
  }).single("profilePic"),
  validation(profilePicSchema),
  async (req, res) => {
    console.log(req.file);
    const result = await uploadProfilePic(req.user._id, req.file);
    return successResponse(res, 201, result);
  },
);
export default userRouter;
