import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Project from '../models/Project';
import connectDB from '../lib/mongodb';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        await connectDB();
        const projects = await Project.find();
        
        // Ensure each project has an ID
        const validatedProjects = projects.map(project => {
            const doc = project.toObject();
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
        await connectDB();
        const projectData = {
            ...req.body,
            id: uuidv4(), // Always generate a new UUID for new projects
            name: req.body.ProjectName || req.body.name || 'Unnamed Project',
            desc: req.body.desc || req.body.Description || 'No description'
        };
        
        const project = new Project(projectData);
        const newProject = await project.save();
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
        await connectDB();
        const projectId = req.params.id;
        const updateData = {
            ...req.body,
            name: req.body.ProjectName || req.body.name || 'Unnamed Project',
            desc: req.body.desc || req.body.Description || 'No description'
        };
        
        const project = await Project.findOneAndUpdate(
            { $or: [{ id: projectId }, { _id: projectId }] },
            updateData,
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        console.log('API - Updated project:', project);
        res.json(project);
    } catch (error) {
        console.error('API - Error updating project:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        await connectDB();
        const projectId = req.params.id;
        const project = await Project.findOneAndDelete(
            { $or: [{ id: projectId }, { _id: projectId }] }
        );
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
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
        await connectDB();
        const projectId = req.params.id;
        const project = await Project.findOne(
            { $or: [{ id: projectId }, { _id: projectId }] }
        );
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        project.favourite = !project.favourite;
        await project.save();
        console.log('API - Toggled project favorite:', project);
        res.json(project);
    } catch (error) {
        console.error('API - Error toggling project favorite:', error);
        res.status(400).json({ message: error.message });
    }
});

export default router; 