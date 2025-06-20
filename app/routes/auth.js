const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { connectDB } = require('../lib/database');
const { ObjectId } = require('mongodb');

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { db } = await connectDB();
        
        const userDoc = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
        if (!userDoc) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = User.fromMongoDoc(userDoc);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Sign Up
router.post('/sign-up', async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        // Validation
        if (!email || !userName || !password) {
            return res.status(400).json({ 
                message: 'Email, username and password are required' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        const { db } = await connectDB();

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email already exists' 
            });
        }

        // Create new user
        const hashedPassword = await User.hashPassword(password);
        const newUser = new User({
            email,
            userName,
            password: hashedPassword
        });

        const result = await db.collection('users').insertOne(newUser.toMongoDoc());
        newUser._id = result.insertedId;

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id.toString() },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user: newUser.toPublicJSON(),
            token
        });

    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Sign In
router.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        const { db } = await connectDB();

        // Find user by email
        const userDoc = await db.collection('users').findOne({ email });
        if (!userDoc) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const user = User.fromMongoDoc(userDoc);

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ 
                message: 'Account is deactivated' 
            });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Sign in successful',
            user: user.toPublicJSON(),
            token
        });

    } catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            user: req.user.toPublicJSON()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { userName } = req.body;
        const { db } = await connectDB();

        if (!userName) {
            return res.status(400).json({ 
                message: 'Username is required' 
            });
        }

        const updateData = {
            userName,
            updatedAt: new Date()
        };

        await db.collection('users').updateOne(
            { _id: req.user._id },
            { $set: updateData }
        );

        // Get updated user
        const updatedUserDoc = await db.collection('users').findOne({ _id: req.user._id });
        const updatedUser = User.fromMongoDoc(updatedUserDoc);

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser.toPublicJSON()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { db } = await connectDB();

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'New password must be at least 6 characters long' 
            });
        }

        // Verify current password
        const isValidPassword = await User.verifyPassword(currentPassword, req.user.password);
        if (!isValidPassword) {
            return res.status(400).json({ 
                message: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const hashedNewPassword = await User.hashPassword(newPassword);

        await db.collection('users').updateOne(
            { _id: req.user._id },
            { 
                $set: { 
                    password: hashedNewPassword,
                    updatedAt: new Date()
                } 
            }
        );

        res.json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // In a more advanced setup, you might want to blacklist the token
        // For now, we'll just return success and let the client remove the token
        res.json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 