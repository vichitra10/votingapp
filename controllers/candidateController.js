const mongoose = require('mongoose');
const Candidate = require('../models/Candidate'); // Import User model
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// if admin then create candidate 

const isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(user)
            
            return user.role === 'admin';
    }
    catch(error)
    {
        return false;   
    }
}

// Signup function
const create = async (req, res) => {
    try {
        console.log("Decoded User in Request:", req.user); // Debugging req.user
        console.log("Token in Request:", req.token);      // Debugging req.token

        const isAdminUser = await isAdmin(req.user.id);

        console.log(isAdminUser);

        if (!isAdminUser) {
            return res.status(403).json({ message: "User is not authorized to perform this action" });
        }

        const candidateData = req.body;
        if (!candidateData.name || !candidateData.party || !candidateData.age) {
            return res.status(400).json({ message: 'Name, Party and Age are required fields' });
        }

        const newCandidate = new Candidate(candidateData);
        await newCandidate.save();

        res.status(201).json({ message: 'Candidate successfully registered', candidate: newCandidate });
    } catch (error) {
        console.error('Error during candidate creation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const update = async (req, res) => {
    try {
        // Check if the user is an admin
        const isAdminUser = await isAdmin(req.user.id); // Ensure isAdmin is async
        if (!isAdminUser) {
            return res.status(403).json({ message: "User not authorized" });
        }

        // Extract candidate ID from request parameters
        const candidateId = req.params.candidateid;

        // Validate required fields in the request body
        const candidateData = req.body;
        
        // Validate candidate data (you may remove the check if all fields are optional)
        if (!candidateData.name && !candidateData.party && !candidateData.age) {
            return res.status(400).json({ message: "At least one field (name, party, or age) must be provided for update" });
        }

        // Find the candidate by ID
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Update the candidate fields (only those provided in the request body)
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            candidateId,
            { $set: candidateData }, // Only update provided fields
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        // Return updated candidate data
        res.status(200).json({ message: "Candidate updated successfully", candidate: updatedCandidate });
        
    } catch (error) {
        console.error("Error updating candidate:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};



const deletedata = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!isAdmin(req.user.id)) {
            return res.status(403).json({ message: "User not authorized" });
        }

        // Extract the candidate ID from request parameters
        const candidateId = req.params.candidateid;

        // Find and delete the candidate by ID
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

        // Check if the candidate exists
        if (!deletedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json({ message: "Candidate deleted successfully", candidate: deletedCandidate });
    } catch (error) {
        console.error("Error deleting candidate:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const votecount = (req, res) => {
    try{

    }
    catch(error)
    {
        res.status(500).json({ message: "Internal Server Error" });   
    }
}





module.exports = { create , update, deletedata };
