const moongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema

const userSchema = new moongoose.Schema({

   name:{
    type: String,
    required: true
   },
   age:{
    type: Number,
    required: true
   }
   ,
   email:{
    type: String,
    // required: true
   },
   mobile:{
    type: String,
    // required: true
   },
   address:{
    type: String,
    required: true
   },
   aadharcardnumber:{
    type: String,
    required: true,
    unique: true,
    sparse: true
   },
   password:
   {
    type: String,
    required: true
   },
   role:{
    type:String,
    enum: ['voter', 'admin'],
    default:'voter'
   },
   isvoted:{ 
    type:Boolean,
    default:false
   },
   token: {
      type: String, // To store the current JWT token
  }

});

const User =  moongoose.model('User', userSchema);
module.exports = User;