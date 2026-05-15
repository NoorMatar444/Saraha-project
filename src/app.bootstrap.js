import geoip from "geoip-lite";
import { port } from "../config/config.service.js";
import express from "express";
import testDbConnection from "./DB/connection.db.js";
import authRouter from "./modules/auth/auth.controller.js";
import { errorHandling } from "./Common/response/errorResponse.js";
import userRouter from "./modules/user/user.controller.js";
import cors from "cors";
import { testRedisConnection } from "./DB/redis.connection.js";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import messageRouter from "./modules/Messages/messages.controller.js";
import * as redisMethod from "./DB/redis.service.js";

async function bootstrap() {
  const app = express();
  //convert buffer data
  await testDbConnection();
  await testRedisConnection();
  app.set("trust proxy", true);
  app.use(cors());
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      limit: (req, res) => {
        const geoInfo = geoip.lookup(req.ip);
        return geoInfo?.country == "EG" ? 3 : 0;
      },
      handler: (req, res) => {
        return res.status(429).json({ message: "Rate limit exceeded" });
      },
      keyGenerator: (req) => {
        const ip = ipKeyGenerator(req.ip);
        return `${ip}-${req.path}`;
      },
      store:{
        incr: async (key, cb) => {
            const hits= await redisMethod.incr(key)
            if(hits==1){
                await redisMethod.setExpire(key,60)
            }
            cb(null,hits)
        },
        async decrement(key) {
            const isKeyExist= await redisMethod.exists(key)
            if(isKeyExist){
                await redisMethod.decr(key)
            }
        }
      }
    }),
  );
  //application routing
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  //invalid routing
  app.use("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  //error-handling
  app.use(errorHandling);

  app.listen(port, () => console.log(`Example app listening on port ${port}`));
}
export default bootstrap;
