import {
  ENCRYPTION_KEY,
  SALT_ROUNDS,
  GOOGLE_CLIENT_ID,
} from "../../../config/config.service.js";
import {
  badRequestException,
  conflictException,
  notFoundException,
} from "../../Common/response/errorResponse.js";
import { create, findOne, updateOne } from "../../DB/model/db.repository.js";
import User from "../../DB/model/user.model.js";
import { compareHash, hashValue } from "../../Common/Security/hash.js";
import CryptoJS from "crypto-js";
import { providerEnums } from "../../Common/Enums/user.enums.js";
import { generateAccessAndRefreshToken } from "../../Common/Security/token.js";
import { OAuth2Client } from "google-auth-library";
import { generateOtp } from "../../Common/OTP/otp.service.js";
import sendMail from "./../../Common/Email/email.config.js";
import { EmailEnum } from "../../Common/Enums/email.enum.js";
import * as RedisMethods from "../../DB/redis.service.js";

async function sendEmailOtp({ email, emailType, subject }) {
  const pervOtpTtl = await RedisMethods.ttl(
    RedisMethods.getOtpKey({ email, emailType }),
  );
  if (pervOtpTtl > 0)
    badRequestException(`you can request new OTP after ${pervOtpTtl} seconds`);

  const isBlocked = await RedisMethods.exists(
    RedisMethods.getOtpBlockedKey({ email, emailType }),
  );
  if (isBlocked)
    badRequestException(
      "you have requested OTP 5 times, please try again after 10 minutes",
    );
  const reqNo = await RedisMethods.get(
    RedisMethods.getOtpReqNoKey({ email, emailType }),
  );
  if (reqNo == 5) {
    await RedisMethods.set({
      key: RedisMethods.getOtpBlockedKey({ email, emailType }),
      value: 1,
      exValue: 60 * 10,
    });
    return badRequestException(
      "you have requested OTP 5 times, please try again after 20 minutes",
    );
  }
  const otp = generateOtp();
  await sendMail({
    to: email,
    subject,
    html: `<h1>Your confirmation code is ${otp}</h1>`,
  });
  await RedisMethods.set({
    key: RedisMethods.getOtpKey({ email, emailType }),
    value: await hashValue({ plainText: otp, rounds: SALT_ROUNDS }),
    exValue: 120,
  });
  await RedisMethods.incr(RedisMethods.getOtpReqNoKey({ email, emailType }));
}

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

  await sendEmailOtp({
    email,
    emailType: EmailEnum.confirmEmail,
    subject: "send Confirmation OTP",
  });

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

export async function confirmEmail(body) {
  const { email, OTP } = body;
  const user = await findOne({
    model: User,
    filter: { email, confirmEmail: false },
  });
  if (!user) badRequestException("user not found or already confirmed");
  const key = RedisMethods.getOtpKey({
    email,
    emailType: EmailEnum.confirmEmail,
  });

  const storedOtp = await RedisMethods.get(key);
  if (!storedOtp) badRequestException("OTP expired");
  const isOtpValid = await compareHash({
    plainText: OTP,
    hashedValue: storedOtp,
  });
  if (!isOtpValid) badRequestException("Invalid OTP");
  user.confirmEmail = true;
  await user.save();
  return user;
}

export async function resendForgetPasswordOtp(email) {
  await sendEmailOtp({
    email,
    emailType: EmailEnum.forgetPassword,
    subject: "Resend Forget Password OTP",
  });
}


export async function resendConfirmEmailOtp(email) {
  await sendEmailOtp({
    email,
    emailType: EmailEnum.confirmEmail,
    subject: "Resend Confirmation OTP",
  });
}

export async function sendOtpForgetPassword(email){
  const user= await findOne({model:User,
    filter:{email}
  })
  if(!user) notFoundException("user not found")
    if(user.confirmEmail==false){
      badRequestException("please confirm your email first")
    }
    await sendEmailOtp({
      email,
      emailType: EmailEnum.forgetPassword,
      subject: "OTP to reset your password",
    })
}

export async function verifyOtpForgetPassword(body){
  const { email, OTP } = body;
  const emailOtp=await RedisMethods.get(RedisMethods.getOtpKey({
    email,
    emailType: EmailEnum.forgetPassword,
  }))
  if (!emailOtp) badRequestException("OTP expired");
  const isOtpValid=await compareHash({
    plainText: OTP,
    hashedValue: emailOtp,
  })
  if(!isOtpValid) badRequestException("Invalid OTP")
    
}


export async function resetPassword(body){
  const { email, OTP, Password } = body;
  await verifyOtpForgetPassword({email, OTP})
  await updateOne({
    model:User,
    filter:{email},
    data:{password: await hashValue({plainText: Password, rounds: SALT_ROUNDS})}
  })
}