const moongoose = require('mongoose');
const User = require('../models/User');
//const becrypt = require('becrypt');


// Define the user schema

const candidateSchema = new moongoose.Schema({

   name:{
    type: String,
    required: true,
    unique: true,
   },

   party:{
    type: String,
    required:true

   },
   age:{
    type: Number,
    required: true
   },

   votes: [
    {
    user:{
        type: moongoose.Schema.Types.ObjectId,
        ref: User,
        required:true
    },
    votedAt:{
        type:Date,
        default:Date.now
    }
    }
        ],
   voteCount: {
    type:Number,
    default:0
   }

});

const Candidate =  moongoose.model('Candidate', candidateSchema);
module.exports = Candidate;