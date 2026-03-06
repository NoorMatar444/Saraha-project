import {
  decodeToken,
  getSignature,
  verifyToken,
} from "../Common/Security/token.js";
import { findById } from "../DB/model/db.repository.js";
import User from "../DB/model/user.model.js";
import { TokenType } from "./../Common/Enums/token.enums.js";

export function authentication(tokenTypepram = TokenType.access) {
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
    if (tokenType !== tokenTypepram) {
      throw new Error("Invalid token type");
    }
    const { signature, refreshSignature } = getSignature(userRole);

    const verifiedToken = verifyToken({
      token,
      signature:
        tokenTypepram === TokenType.access ? signature : refreshSignature,
    });

    const user = await findById({ model: User, id: verifiedToken.id });
    if (!user) {
      return unAuthorizedException("User not found signup again");
    }
    req.user = user;
    next();
  };
}
