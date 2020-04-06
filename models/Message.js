const mongoose = require("mongoose"); // import mongoose dependencie

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,
  date: { type: Date, default: Date.now },
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
