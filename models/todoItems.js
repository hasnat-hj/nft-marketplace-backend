//import mongoose to create mongoose model
const mongoose = require('mongoose');

//create Schema
const TodoItemSchema = new mongoose.Schema({
  id:{
    type:String,
    required: true
  },
  name:{
    type:String,
    required: true
  },
  price:{
    type:String,
    required: true
  },
  image:{
    type: String,
    required:true
  }
})

//export this Schema
module.exports = mongoose.model('todo', TodoItemSchema);