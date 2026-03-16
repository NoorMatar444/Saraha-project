import mongoose,{ Types } from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
    jti:{ type:String,required:true},
    userId:{ type:Schema.Types.ObjectId, ref:'User', required:true},
    expiredAt:{type:Date, required:true}
})
tokenSchema.index("expiredAt",{ expireAfterSeconds:0})
const tokenModel = mongoose.model('Token', tokenSchema);
export default tokenModel;