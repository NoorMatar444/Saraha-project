
import { TokenType } from "../../Common/Enums/token.enums.js";
import { RoleEnums } from "../../Common/Enums/user.enums.js";
import { unAuthorizedException } from "../../Common/response/errorResponse.js";
import { findById, updateOne } from "../../DB/model/db.repository.js";
import User from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import { decodeToken, generateToken, getSignature, verifyToken } from "../../Common/Security/token.js";
import decryptValue from "../../Common/Security/encrypt.js";

export async function renewToken(userData) {
  const {signature}=  getSignature(userData.role);
  const newAccessToken = generateToken({
    payload: { id: userData.id },
    signature: signature,
    options: {
      expiresIn: 60 * 15,
      audience: [userData.role, TokenType.access],
    },
  });
  return newAccessToken;
}


export async function uploadProfilePic(userId,file){
  await updateOne({
    model:User,
    filter:{_id:userId},
    data:{profilePic:file.finalPath}
  }
  )
}

export async function coverProfilePic(userId,files){
  const profilePicsPath=files.map((file)=>{
    return file.finalPath
  })
  await updateOne({
    model:User,
    filter:{_id:userId},
    data:{coverPic:profilePicsPath}
  }
  )
}

export async function getAnotherProfile(profileId){
  const user=await findById({
    model:User,
    id:profileId,
    select:"-password -confirmEmail -role -provider -createdAt -updatedAt -__v"
  })
  if (user.phone) {
    user.phone=decryptValue({cipherText:user.phone});
  }
  return user;
}

