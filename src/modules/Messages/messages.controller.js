import express from "express";
import { authentication } from "./../../middleware/authentication.middleware.js";
import {
  allowFileFormat,
  localUpload,
} from "./../../Common/Multer/multer.config.js";
import {
  sendMessageByIdSchema,
  sendMessageSchema,
} from "./messages.validation.js";
import { validation } from "../../middleware/validate.middleware.js";
import { getAllMsgs, sendMessage } from "./messages.service.js";
import { successResponse } from "./../../Common/response/successResponse.js";

const messageRouter = express.Router();

messageRouter.post("/:receiverId", async (req, res, next) => {
  const { authorization } = req.headers; // Check if the user is loggedIn before allowing them to send a message
  if (authorization) {
    //  if the user is not logged in, they can still send a message but they must provide content or attachments
    const authMiddleware = authentication();
    return authMiddleware(req, res, next());
  }
  next();
  localUpload({
    folderName: "Messages",
    allowedFormat: [...allowFileFormat.img, ...allowFileFormat.video],
  }).array("msgAttachments", 5); // the front end will send files under the key "msgAttachments" and allowing up to 5 files
  (validation(sendMessageSchema),
    async (req, res) => {
      // if no content or attachments are provided, return an error
      if (!req.user && !req.files) {
        return badRequestException(
          "You must provide content or attachments to send a message",
        );
      }
      await sendMessage(
        req.params.receiverId,
        req.user?._id,
        req.body.content,
        req.files,
      );
    });
});

messageRouter.post(
  "/getMsgById/:messageId",

  authentication(), // ✅ middleware 1

  validation(sendMessageByIdSchema), // ✅ middleware 2

  async (req, res) => {
    const result = await getMsgById(req.user, req.params.messageId);

    return res.status(200).json({
      success: true,
      message: "Message retrieved successfully",
      data: result,
    });
  },
);


messageRouter.post(
  "/getAllMsgs",

  authentication(), // ✅ middleware 1

  validation(sendMessageByIdSchema), // ✅ middleware 2

  async (req, res) => {
    const result = await getAllMsgs(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: result,
    });
  },
);


messageRouter.delete(
  "/deleteMsg/:messageId",

  authentication(), // ✅ middleware 1

  validation(sendMessageByIdSchema), // ✅ middleware 2

  async (req, res) => {
    const result = await deleteMsgs(req.user, req.params.messageId);

    return res.status(200).json({
      success: true,
      message: "Messages deleted successfully",
      data: result,
    });
  },
);
export default messageRouter;
