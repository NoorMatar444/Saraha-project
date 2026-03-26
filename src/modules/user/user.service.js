import { TokenType } from "../../Common/Enums/token.enums.js";
import { RoleEnums } from "../../Common/Enums/user.enums.js";
import { unAuthorizedException } from "../../Common/response/errorResponse.js";
import { create, findById, updateOne } from "../../DB/model/db.repository.js";
import User from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import {
  decodeToken,
  generateToken,
  getSignature,
  verifyToken,
} from "../../Common/Security/token.js";
import { decryptValue } from "../../Common/Security/encrypt.js";
import * as redisService from "../../DB/redis.service.js";

export async function renewToken(userData) {
  const { signature } = getSignature(userData.role);
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

export async function uploadProfilePic(userId, file) {
  const user = await updateOne({
    model: User,
    filter: { _id: userId },
    data: {
      profilePic: file.path,
    },
  });

  return user;
}

export async function coverProfilePic(userId, files) {
  const profilePicsPath = files.map((file) => {
    return file.finalPath;
  });
  await updateOne({
    model: User,
    filter: { _id: userId },
    data: { coverPic: profilePicsPath },
  });
}

export async function getAnotherProfile(profileId) {
  const user = await findById({
    model: User,
    id: profileId,
    select:
      "-password -confirmEmail -role -provider -createdAt -updatedAt -__v",
  });
  if (user.phone) {
    user.phone = decryptValue({ cipherText: user.phone });
  }
  return user;
}

export async function Logout(userId, tokenData, logoutOption) {
  if (logoutOption === "all") {
    await updateOne({
      model: tokenModel,
      filter: { _id: userId },
      data: { changeCreditTime: Date.now() },
    });
  } else {
    await redisService.set({
    key: redisService.getBlackListTokenKey({userId,tokenId:tokenData.jti}),
    value:tokenData.jti,
    exValue:60*60*24*365 -(Date.now() - tokenData.iat * 1000)/1000
  })
  }

  return token;
}
