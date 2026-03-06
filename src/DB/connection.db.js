import {connect} from 'mongoose'
import { DB_URL_LOCAL } from '../../config/config.service.js';



async function testDbConnection() {
  try {
      await connect(DB_URL_LOCAL);
      console.log("DB connected successfully")
  } catch (error) {
     console.log("Error connecting to DB", error)
  }
  }

export default testDbConnection;