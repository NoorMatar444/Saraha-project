
import { TokenType } from "../../Common/Enums/token.enums.js";
import { RoleEnums } from "../../Common/Enums/user.enums.js";
import { unAuthorizedException } from "../../Common/response/errorResponse.js";
import { findById, updateOne } from "../../DB/model/db.repository.js";
import User from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import {
  TOKEN_SIGNATURE_ADMIN,
  TOKEN_SIGNATURE_ADMIN_REFRESH,
  TOKEN_SIGNATURE_USER_REFRESH,
  TOKEN_SIGNATURE_USER,
} from "./../../../config/config.service.js";
import { decodeToken, generateToken, getSignature, verifyToken } from "../../Common/Security/token.js";


export async function uploadProfilePic(userId,file){
  await updateOne({
    model:User,
    filter:{_id:userId},
    data:{profilePic:file.finalPath}
  }
  )
}

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

