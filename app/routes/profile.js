const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { connectDB } = require('../lib/database');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/profile-photos');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const { db } = await connectDB();
        const userId = req.params.userId;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userObj = User.fromMongoDoc(user);
        res.json(userObj.toPublicJSON());
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
router.put('/:userId', async (req, res) => {
    try {
        const { db } = await connectDB();
        const userId = req.params.userId;
        const updateData = req.body;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Remove sensitive fields from update data
        delete updateData.password;
        delete updateData._id;
        delete updateData.id;
        
        updateData.updatedAt = new Date();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Upload profile photo
router.post('/:userId/photo', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { db } = await connectDB();
        const userId = req.params.userId;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Check if user exists
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile photo if exists
        if (user.profilePhoto) {
            const oldPhotoPath = path.join(__dirname, '../uploads/profile-photos', user.profilePhoto);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Update user with new profile photo
        const photoUrl = `/api/profile/${userId}/photo/${req.file.filename}`;
        
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { 
                $set: { 
                    profilePhoto: req.file.filename,
                    profilePhotoUrl: photoUrl,
                    updatedAt: new Date()
                } 
            }
        );

        res.json({ 
            message: 'Profile photo uploaded successfully',
            photoUrl: photoUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve profile photo
router.get('/:userId/photo/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const photoPath = path.join(__dirname, '../uploads/profile-photos', filename);
        
        if (fs.existsSync(photoPath)) {
            res.sendFile(photoPath);
        } else {
            res.status(404).json({ message: 'Photo not found' });
        }
    } catch (error) {
        console.error('Error serving profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete profile photo
router.delete('/:userId/photo', async (req, res) => {
    try {
        const { db } = await connectDB();
        const userId = req.params.userId;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete photo file if exists
        if (user.profilePhoto) {
            const photoPath = path.join(__dirname, '../uploads/profile-photos', user.profilePhoto);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        // Update user to remove profile photo
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { 
                $set: { 
                    profilePhoto: null,
                    profilePhotoUrl: '',
                    updatedAt: new Date()
                } 
            }
        );

        res.json({ message: 'Profile photo deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 