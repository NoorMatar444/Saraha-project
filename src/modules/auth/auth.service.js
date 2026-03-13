import {
  ENCRYPTION_KEY,
  SALT_ROUNDS,
  TOKEN_SIGNATURE_ADMIN,
  TOKEN_SIGNATURE_USER,
  TOKEN_SIGNATURE_ADMIN_REFRESH,
  TOKEN_SIGNATURE_USER_REFRESH,
  GOOGLE_CLIENT_ID,
} from "../../../config/config.service.js";
import {
  conflictException,
  notFoundException,
} from "../../Common/response/errorResponse.js";
import { create, findOne } from "../../DB/model/db.repository.js";
import User from "../../DB/model/user.model.js";
import { compareHash, hashValue } from "../../Common/Security/hash.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { providerEnums, RoleEnums } from "../../Common/Enums/user.enums.js";
import { TokenType } from "./../../Common/Enums/token.enums.js";
import {
  generateAccessAndRefreshToken,
  generateToken,
  getSignature,
} from "../../Common/Security/token.js";
import { OAuth2Client } from "google-auth-library";
// Encrypt

// Decrypt

export async function signup(body) {
  const { email } = body;
  const isUserExist = await findOne({ model: User, filter: { email } });
  if (isUserExist) conflictException("User already exist");
  const hashedPassword = await hashValue({
    plainText: body.password,
    rounds: SALT_ROUNDS,
  });
  body.password = hashedPassword;
  if (body.phone) {
    const phoneEncrypted = CryptoJS.AES.encrypt(
      body.phone,
      ENCRYPTION_KEY,
    ).toString();
    body.phone = phoneEncrypted;
  }
  const user = await create({ model: User, insertedData: body });
  return user;
}

export async function login(body) {
  const { email, password } = body;
  const user = await findOne({ model: User, filter: { email } });
  if (!user) notFoundException("user not found");
  const isPasswordValid = await compareHash({
    plainText: password,
    hashedValue: user.password,
  });
  if (!isPasswordValid) notFoundException("Invalid email or password");
  var bytes = CryptoJS.AES.decrypt(user.phone, ENCRYPTION_KEY);
  var originalPhone = bytes.toString(CryptoJS.enc.Utf8);
  user.phone = originalPhone;

  return generateAccessAndRefreshToken(user);
}

async function verifyGoogleToken(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log({ payload });
  return payload;
}

export async function signupWithGoogle(body) {
  console.log({ body });
  const { idToken } = body;
  const payloadGoogleToken = await verifyGoogleToken(idToken);
  if (!payloadGoogleToken.email_verified) {
    throw new Error("Email not verified");
  }
  const user = await findOne({
    model: User,
    filter: { email: payloadGoogleToken.email },
  });
  if (user) {
    if (user.provider == providerEnums.SYSTEM) {
      throw new Error("please signup with email and password");
    }
    return { loginResult: await loginWithGoogle(body), status: 200 };
  }
  const newUser = await create({
    model: User,
    insertedData: {
      username: payloadGoogleToken.name,
      email: payloadGoogleToken.email,
      provider: providerEnums.GOOGLE,
      profilePic: payloadGoogleToken.picture,
      confirmEmail: true,
    },
  });

  return { status: 201, result: generateAccessAndRefreshToken(newUser) };
}
export async function loginWithGoogle(body) {
  const { idToken } = body;
  const payloadGoogleToken = await verifyGoogleToken(idToken);
  if (!payloadGoogleToken.email_verified) {
    throw new Error("Email not verified");
  }
  const user = await findOne({
    model: User,
    filter: {
      email: payloadGoogleToken.email,
      provider: providerEnums.GOOGLE,
    },
  });
  if (!user) {
    return signupWithGoogle(body);
  }

  return generateAccessAndRefreshToken(user);
}
