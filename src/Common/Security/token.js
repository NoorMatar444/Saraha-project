import { randomUUID } from "node:crypto";
import { TokenType } from "../Enums/token.enums.js";
import { RoleEnums } from "../Enums/user.enums.js";
import { TOKEN_SIGNATURE_ADMIN, TOKEN_SIGNATURE_ADMIN_REFRESH, TOKEN_SIGNATURE_USER, TOKEN_SIGNATURE_USER_REFRESH } from './../../../config/config.service.js';
import  jwt  from 'jsonwebtoken';

export function getSignature(role = RoleEnums.USER) {
  let signature = "";
  let refreshSignature = "";
  switch (role) {
    case RoleEnums.ADMIN:
      signature = TOKEN_SIGNATURE_ADMIN;
      refreshSignature = TOKEN_SIGNATURE_ADMIN_REFRESH;
      break;
    default:
      signature = TOKEN_SIGNATURE_USER;
      refreshSignature = TOKEN_SIGNATURE_USER_REFRESH;
      break;
  }
    return { signature, refreshSignature };
}

export function generateToken({payload={}, signature, options={}}){
  return jwt.sign(payload, signature, options)
}

export function verifyToken({token, signature}){
  return jwt.verify(token, signature);
}
export function decodeToken(token){
  return jwt.decode(token);
}

export function generateAccessAndRefreshToken(user){
  const { signature, refreshSignature } = getSignature(user.role);
  const tokenId= randomUUID()
    const accessToken = generateToken({
      payload: { id: user._id, role: user.role },
      signature,
      options: {
        audience: [user.role, TokenType.access],
        expiresIn: "1d",
        jwtid: tokenId
      },
    });
    const refreshToken = generateToken({
      payload: { id: user._id, role: user.role },
      signature: refreshSignature,
      options: {
        audience: [user.role, TokenType.refresh],
        expiresIn: "1y",
        jwtid: tokenId
      },
    });
    return { accessToken, refreshToken };
}