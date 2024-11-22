const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model
const Candidate = require('../models/Candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// controllers/voteController.js
const count = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: -1 });
        const voteRecord = candidates.map(candidate => ({
            party: candidate.party,
            count: candidate.voteCount,
        }));
        res.status(200).json({ data: voteRecord });
    } catch (error) {
        console.error("Error in count function:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const list = async (req, res) => {
    try{

        const list = await Candidate.find();
        return res.status(200).json({
            'message':'Candidate List', 'list': list 
        })

    }
    catch(error)
    {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// Ensure this is exported as an object
module.exports = { count, list };
