import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { Project } from '../models/Project';
import connectDB from '../lib/mongodb';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectData: Project = {
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
router.put('/:id', async (req, res) => {
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
        let query: { id: string } | { _id: ObjectId } = { id: projectId };
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
router.delete('/:id', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.id;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query: { id: string } | { _id: ObjectId } = { id: projectId };
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
router.patch('/:id/favorite', async (req, res) => {
    try {
        const { db } = await connectDB();
        const projectId = req.params.id;
        
        // Try to find by UUID first, then by MongoDB ObjectId
        let query: { id: string } | { _id: ObjectId } = { id: projectId };
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

export default router; 