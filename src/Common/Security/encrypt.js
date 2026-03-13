import { ENCRYPTION_KEY } from "../../../config/config.service.js";
import  CryptoJS  from 'crypto-js';


export function encryptValue({value,Key=ENCRYPTION_KEY}){
    return CryptoJS.AES.encrypt(value,Key).toString()
}

export function decryptValue({cipherText,Key=ENCRYPTION_KEY}){
    return CryptoJS.AES.decrypt(cipherText,Key).toString(CryptoJS.enc.Utf8)
}