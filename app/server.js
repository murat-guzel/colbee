const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/colbee';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0] || 'colbee';

// MongoDB Connection with caching
let cached = global.mongodb;
if (!cached) {
    cached = global.mongodb = { conn: null, client: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
            return {
                client,
                db: client.db(DB_NAME)
            };
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('Connected to MongoDB');
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB connection error:', e);
        throw e;
    }

    return cached.conn;
}

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 