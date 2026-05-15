import { create, findById, findOne,find, deleteOne } from "../../DB/model/db.repository.js";
import User from "./../../DB/model/user.model.js";
import { badRequestException, notFoundException } from "./../../Common/response/errorResponse.js";
import Message from "../../DB/model/message.model.js";

export async function sendMessage({
  senderId,
  receiverId,
  content,
  filesData,
}) {
  const receiver = await findById({ model: User, id: receiverId });
  if (!receiver) {
    return badRequestException("Receiver not found");
  }
  await create({
    model: Message,
    data: {
      senderId,
      receiverId,
      content,
      attachments: filesData.map((file) => file.finalPath), // Assuming file.finalPath contains the path to the uploaded file
    },
  });
}

export async function getMsgById(userData, messageId) {
    const msg= await findOne({
        model:Message,
        filter:{
            _id:messageId,
            receiverId:userData._id,
        },
        select:"-senderId"
    })
    if(!msg){
        return notFoundException("Message not found")
    }
    return msg;
}

export async function getAllMsgs(userId) {
    const msgs= await find({
        model:Message,
        filter:{
            $or:[
                {receiverId:userId},
                {senderId:userId}
            ]
        },
        select:"-senderId"
    })
    if(!msgs.length){
        return notFoundException("Messages not found")
    }
    return msgs;
}


export async function deleteMsgs(userData, messageId) {
    const msgs= await deleteOne({
        model:Message,
        filter:{
            _id:messageId,
            receiverId:userData._id,
        },
        select:"-senderId"
    })
    if(!msgs.deletedCount){
        return notFoundException("Messages not found")
    }
    return msgs;
}