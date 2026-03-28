
import { NODE_ENV, port } from '../config/config.service.js'
import express from 'express'
import testDbConnection from './DB/connection.db.js'
import authRouter from './modules/auth/auth.controller.js'
import { errorHandling } from './Common/response/errorResponse.js'
import userRouter from './modules/user/user.controller.js'
import cors from 'cors'
import { testRedisConnection } from './DB/redis.connection.js'
import sendMail from './Common/Email/email.config.js'


async function bootstrap() {
    const app = express()
    //convert buffer data
    await testDbConnection()
    await testRedisConnection()
 
    app.use(cors())
    app.use(express.json())
    //application routing
    app.use(authRouter)
    app.use(userRouter)
    


    //invalid routing
    app.use('{/*dummy}', (req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use(errorHandling)
    
    app.listen(port, () => console.log(`Example app listening on port ${port}`))
}
export default bootstrap