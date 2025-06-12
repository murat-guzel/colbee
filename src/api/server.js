const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for your frontend application
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// MongoDB connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectDB();

// Function to get projects from database
async function getProjects(req, res) {
  try {
    const database = client.db('local');
    const collection = database.collection('projects');
    
    const projects = await collection.find({}).toArray();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// API endpoints to get projects (supporting both /api/projects and /projects)
app.get('/api/projects', getProjects);
app.get('/projects', getProjects);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 