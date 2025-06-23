const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { connectDB } = require('./lib/database');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: true, // Allow all origins
    credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// API Routes

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projects = await db.collection('projects').find().toArray();
        
        // Ensure each project has an ID
        const validatedProjects = projects.map(project => {
            const doc = project;
            if (!doc.id && !doc._id) {
                doc.id = uuidv4();
            }
            return {
                ...doc,
                id: doc.id || doc._id.toString(), // Ensure ID is always a string
                name: doc.ProjectName || doc.name || 'Unnamed Project',
                desc: doc.desc || doc.Description || 'No description'
            };
        });
        
        console.log('API - Sending projects:', validatedProjects);
        res.json(validatedProjects);
    } catch (error) {
        console.error('API - Error fetching projects:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single project by ID
app.get('/api/projects/:id', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.id;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query = { id: projectId };
        let project = await db.collection('projects').findOne(query);
        
        if (!project && ObjectId.isValid(projectId)) {
            query = { _id: new ObjectId(projectId) };
            project = await db.collection('projects').findOne(query);
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Ensure project has an ID
        if (!project.id && !project._id) {
            project.id = uuidv4();
        }
        
        const validatedProject = {
            ...project,
            id: project.id || project._id.toString(),
            name: project.ProjectName || project.name || 'Unnamed Project',
            desc: project.desc || project.Description || 'No description'
        };
        
        console.log('API - Sending project:', validatedProject);
        res.json(validatedProject);
    } catch (error) {
        console.error('API - Error fetching project:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectData = {
            ...req.body,
            id: uuidv4(), // Always generate a new UUID for new projects
            name: req.body.ProjectName || req.body.name || 'Unnamed Project',
            desc: req.body.desc || req.body.Description || 'No description',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('projects').insertOne(projectData);
        const newProject = { ...projectData, _id: result.insertedId };
        
        console.log('API - Created new project:', newProject);
        res.status(201).json(newProject);
    } catch (error) {
        console.error('API - Error creating project:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.id;
        const updateData = {
            ...req.body,
            name: req.body.ProjectName || req.body.name || 'Unnamed Project',
            desc: req.body.desc || req.body.Description || 'No description',
            updatedAt: new Date()
        };
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query = { id: projectId };
        let project = await db.collection('projects').findOne(query);
        
        if (!project && ObjectId.isValid(projectId)) {
            query = { _id: new ObjectId(projectId) };
            project = await db.collection('projects').findOne(query);
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        await db.collection('projects').updateOne(query, { $set: updateData });
        const updatedProject = { ...project, ...updateData };
        
        console.log('API - Updated project:', updatedProject);
        res.json(updatedProject);
    } catch (error) {
        console.error('API - Error updating project:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.id;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query = { id: projectId };
        let project = await db.collection('projects').findOne(query);
        
        if (!project && ObjectId.isValid(projectId)) {
            query = { _id: new ObjectId(projectId) };
            project = await db.collection('projects').findOne(query);
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        await db.collection('projects').deleteOne(query);
        
        console.log('API - Deleted project:', project);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('API - Error deleting project:', error);
        res.status(500).json({ message: error.message });
    }
});

// Toggle project favorite status
app.patch('/api/projects/:id/favorite', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.id;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query = { id: projectId };
        let project = await db.collection('projects').findOne(query);
        
        if (!project && ObjectId.isValid(projectId)) {
            query = { _id: new ObjectId(projectId) };
            project = await db.collection('projects').findOne(query);
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const favourite = !project.favourite;
        await db.collection('projects').updateOne(query, { $set: { favourite, updatedAt: new Date() } });
        
        project.favourite = favourite;
        console.log('API - Toggled project favorite:', project);
        res.json(project);
    } catch (error) {
        console.error('API - Error toggling project favorite:', error);
        res.status(400).json({ message: error.message });
    }
});

// Comments API Routes

// Get all comments for a project
app.get('/api/projects/:projectId/comments', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.projectId;
        
        // Try to find project by UUID first, then by MongoDB ObjectId
        let projectQuery = { id: projectId };
        let project = await db.collection('projects').findOne(projectQuery);
        
        if (!project && ObjectId.isValid(projectId)) {
            projectQuery = { _id: new ObjectId(projectId) };
            project = await db.collection('projects').findOne(projectQuery);
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const comments = await db.collection('comments')
            .find({ projectId: projectId })
            .sort({ createdAt: -1 })
            .toArray();
        
        console.log('API - Sending comments for project:', projectId, comments);
        res.json(comments);
    } catch (error) {
        console.error('API - Error fetching comments:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new comment
app.post('/api/projects/:projectId/comments', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.projectId;
        const { content, lineNumber, author, projectName } = req.body;
        
        // Try to find project by UUID first, then by MongoDB ObjectId
        let projectQuery = { id: projectId };
        let project = await db.collection('projects').findOne(projectQuery);
        
        if (!project && ObjectId.isValid(projectId)) {
            projectQuery = { _id: new ObjectId(projectId) };
            project = await db.collection('projects').findOne(projectQuery);
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const commentData = {
            id: uuidv4(),
            projectId: projectId,
            projectName: projectName || project.ProjectName || project.name || 'Unknown Project',
            content: content,
            lineNumber: lineNumber,
            author: author || 'Anonymous',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('comments').insertOne(commentData);
        const newComment = { ...commentData, _id: result.insertedId };
        
        console.log('API - Created new comment:', newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('API - Error creating comment:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update a comment
app.put('/api/comments/:commentId', async (req, res) => {
    try {
        const { db } = await connectDB();
        const commentId = req.params.commentId;
        const { content } = req.body;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query = { id: commentId };
        let comment = await db.collection('comments').findOne(query);
        
        if (!comment && ObjectId.isValid(commentId)) {
            query = { _id: new ObjectId(commentId) };
            comment = await db.collection('comments').findOne(query);
        }
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        const updateData = {
            content: content,
            updatedAt: new Date()
        };
        
        await db.collection('comments').updateOne(query, { $set: updateData });
        const updatedComment = { ...comment, ...updateData };
        
        console.log('API - Updated comment:', updatedComment);
        res.json(updatedComment);
    } catch (error) {
        console.error('API - Error updating comment:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a comment
app.delete('/api/comments/:commentId', async (req, res) => {
    try {
        const { db } = await connectDB();
        const commentId = req.params.commentId;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query = { id: commentId };
        let comment = await db.collection('comments').findOne(query);
        
        if (!comment && ObjectId.isValid(commentId)) {
            query = { _id: new ObjectId(commentId) };
            comment = await db.collection('comments').findOne(query);
        }
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        await db.collection('comments').deleteOne(query);
        
        console.log('API - Deleted comment:', comment);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('API - Error deleting comment:', error);
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 