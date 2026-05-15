import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: function () {
        return !this.attachments.length;
      },
    },
    attachments: [String],
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
