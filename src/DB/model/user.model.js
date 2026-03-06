import mongoose from 'mongoose';
import { GenderEnums, providerEnums, RoleEnums } from '../../Common/Enums/user.enums.js';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, 
        required: function(){
            return this.provider === providerEnums.SYSTEM
        }
     },
    DOB:{
        type: Date,
    },
    gender:{
        type: String,
        enum: Object.values(GenderEnums),
        default: GenderEnums.MALE
    },
    confirmEmail:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
    },
    role:{
        type: String,
        enum: Object.values(RoleEnums),
        default: RoleEnums.USER
    },
    provider:{
        type: String,
        enum: Object.values(providerEnums),
        default: providerEnums.SYSTEM
    },
    profilePic:String
},
 { timestamps: true }
);


const User = mongoose.model('User', userSchema);
export default User;