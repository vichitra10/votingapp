const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model
const Candidate = require('../models/Candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup function
const signUp = async (req, res) => {
    try {
        // Store all incoming data in a variable
        const userData = req.body;
        console.log(userData);

        // Validate required fields
        if (!userData.name || !userData.age || !userData.aadharcardnumber || !userData.password) {
            return res.status(400).json({ message: 'Name, age, Aadhar number, and password are required' });
        }

        // Check if a user already exists with the same Aadhar number
        const existingUser = await User.findOne({ aadharcardnumber: userData.aadharcardnumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Aadhar number already registered' });
        }

        // Hash the password before saving
        userData.password = await bcrypt.hash(userData.password, 10);

        // Generate a JWT token
        const token = jwt.sign(
            { userId: userData._id }, // Payload
            process.env.JWT_SECRET || 'yourSecretKey', // Secret key
            { expiresIn: '1h' } // Expiry time
        );

        // Add the token to the user data
        userData.token = token;

        // Create and save the new user
        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({ message: 'User successfully registered', user: newUser, token: token });
    } catch (error) {
        
        res.status(500).json({
            //message: 'Internal Server Error',
            error: error.message, // Include the error message in the response
            stack: error.stack,  // Optional: Include stack trace for debugging (avoid in production)
        });
    }
};


const signIn = async (req, res) => {
    try {
        const { aadharcardnumber, password } = req.body;

        if (!aadharcardnumber || !password) {
            return res.status(400).json({ message: 'Aadhar number and password are required' });
        }

        // Find user by Aadhar number
        const user = await User.findOne({ aadharcardnumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found with this Aadhar number' });
        }

        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate a new JWT token
        const token = jwt.sign(
            { userId: user._id }, // Payload
            process.env.JWT_SECRET || 'yourSecretKey', // Secret key
            { expiresIn: '1h' } // Expiry time
        );

        // Update the user's token in the database
        user.token = token;
        await user.save();

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const voteTo = async (req, res) => {
    const candidateId = req.params.candidateId; // Ensure `const` is used to avoid accidental reassignments
    const userId = req.user.id; // Ensure `const` is used
    console.log(userId);

    try {
        // Find the candidate by ID
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already voted
        if (user.isvoted) {
            return res.status(400).json({ message: 'You have already voted' }); // Use 400 for bad request
        }

        // Check if the user is an admin
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admin cannot vote' }); // Use 403 for forbidden
        }

        // Update the candidate document to record the vote
        candidate.votes.push({ user: userId }); // Ensure `votes` is a valid field in your Candidate schema
        candidate.voteCount += 1; // Increment the vote count
        await candidate.save();

        // Update the user document to mark as voted
        user.isvoted = true;
        await user.save(); // Correctly call `save()` on the `user` object

        // Send a success response
        return res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (err) {
        console.error("Error in voteTo function:", err.message); // Log the error for debugging
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



const changePassword = async (req, res) => {
    try {
        const { newPassword, oldPassword } = req.body;

        if (!newPassword || !oldPassword) {
            return res.status(400).json({ message: 'Old password and new password are required' });
        }

        // Get the user ID from the JWT token (from the authenticateJWT middleware)
        const userId = req.user.userId;

        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare old password with the current password in the database
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authToken = req.headers.authorization?.split(' ')[1];

        if (!authToken) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // Find the user by the token
        const user = await User.findOne({ token: authToken });
        if (!user) {
            return res.status(404).json({ message: 'Invalid token or user not found' });
        }

        // Clear the token in the database
        user.token = null;
        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = { signUp , signIn,  voteTo, changePassword, logout};
