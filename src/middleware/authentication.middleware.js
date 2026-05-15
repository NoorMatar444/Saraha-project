import { unAuthorizedException } from "../Common/response/errorResponse.js";
import {
  decodeToken,
  getSignature,
  verifyToken,
} from "../Common/Security/token.js";
import { findById, findOne } from "../DB/model/db.repository.js";
import User from "../DB/model/user.model.js";
import { TokenType } from "./../Common/Enums/token.enums.js";

export function authentication(tokenTypePram = TokenType.access) {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("Authorization header missing");
    }
    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : authorization;
    const decodedToken = decodeToken(token);
    const [userRole, tokenType] = decodedToken.aud;
    if (tokenType !== tokenTypePram) {
      throw new Error("Invalid token type");
    }
    const { signature, refreshSignature } = getSignature(userRole);

    const verifiedToken = verifyToken({
      token,
      signature:
        tokenTypePram === TokenType.access ? signature : refreshSignature,
    });

    const tokenExist = await findOne({
      model: tokenModel,
      filter: { jti: verifiedToken.jti },
    });

    if (tokenExist) {
      return unAuthorizedException("Login again");
    }

    const user = await findById({ model: User, id: verifiedToken.id });
    if (!user) {
      return unAuthorizedException("User not found signup again");
    }
    if(verifiedToken.iat < user.changeCreditTime){
      return unAuthorizedException("Login again");
    }
    req.user = user;
    req.tokenPayload = verifiedToken;
    next();
  };
}
