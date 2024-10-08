const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: { 
    type: [String], 
    default: []
 },
  userId: {
    type: String ,
    required: true,
  },
  isPinned:{
    type: Boolean,
    default: false,
  } ,
  createdOn: {
    type: Date,
    default: new Date().getTime()
  },
});

 
module.exports = mongoose.model("Note", noteSchema);

