import { resolve } from 'node:path';
import { config } from 'dotenv';

// ✅ حمّل NODE_ENV يدوي لو مش موجود
const NODE_ENV = process.env.NODE_ENV || 'development';

// خريطة الملفات
const envPath = {
    development: '.env.development',
    production: '.env.production',
};

// ✅ شغّل dotenv بعد ما تحدد البيئة
config({
    path: resolve(`./config/${envPath[NODE_ENV]}`)
});

export { NODE_ENV };

export const port = process.env.PORT ?? 3000;
export const DB_URL_LOCAL = process.env.DB_URL_LOCAL ?? "";
export const DB_URL_ATLAS = process.env.DB_URL_ATLAS ?? "";
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 11;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? "asdfghjkl1234567890"
export const TOKEN_SIGNATURE_USER = process.env.TOKEN_SIGNATURE_USER ?? "abcdef";
export const TOKEN_SIGNATURE_ADMIN = process.env.TOKEN_SIGNATURE_ADMIN ?? "123456";
export const TOKEN_SIGNATURE_USER_REFRESH = process.env.TOKEN_SIGNATURE_USER_REFRESH ?? "abcdef-refresh";
export const TOKEN_SIGNATURE_ADMIN_REFRESH = process.env.TOKEN_SIGNATURE_ADMIN_REFRESH ?? "123456-refresh";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "10466139006-nh1nv4nsu0ctuorsm4f0q18peou3ce2f.apps.googleusercontent.com";