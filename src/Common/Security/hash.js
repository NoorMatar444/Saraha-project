import { compare, hash } from "bcrypt"



export async function hashValue({plainText,rounds=SALT_ROUNDS}){
   
    return await hash(plainText,rounds)
}

export async function compareHash({plainText,hashedValue}){
    return await compare(plainText,hashedValue)
}

