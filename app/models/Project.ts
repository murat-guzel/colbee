import { Collection, Db, ObjectId } from 'mongodb';
import connectDB from '../lib/mongodb';

export interface ProjectMember {
  id: string;
  name: string;
  img: string;
}

export interface Project {
  _id?: string | ObjectId;
  id: string;
  name: string;
  ProjectName?: string;
  category?: string;
  desc?: string;
  Description?: string;
  attachmentCount?: number;
  totalTask?: number;
  completedTask?: number;
  progression?: number;
  dayleft?: number;
  favourite?: boolean;
  member?: ProjectMember[];
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getProjectsCollection(): Promise<Collection<Project>> {
  const { db } = await connectDB();
  return db.collection('projects');
}

export async function getAllProjects(): Promise<Project[]> {
  const collection = await getProjectsCollection();
  return collection.find().toArray();
}

export async function getProjectById(id: string): Promise<Project | null> {
  const collection = await getProjectsCollection();
  
  // Try to find by UUID first
  let project = await collection.findOne({ id });
  
  // If not found and id is a valid ObjectId, try to find by _id
  if (!project && ObjectId.isValid(id)) {
    project = await collection.findOne({ _id: new ObjectId(id) });
  }
  
  return project;
}

export async function createProject(projectData: Project): Promise<Project> {
  const collection = await getProjectsCollection();
  const result = await collection.insertOne({
    ...projectData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return { ...projectData, _id: result.insertedId };
}

export async function updateProject(id: string, updateData: Partial<Project>): Promise<Project | null> {
  const collection = await getProjectsCollection();
  const project = await getProjectById(id);
  
  if (!project) return null;
  
  const query = project._id instanceof ObjectId 
    ? { _id: project._id } 
    : { id: project.id };
  
  await collection.updateOne(query, { 
    $set: { 
      ...updateData, 
      updatedAt: new Date() 
    } 
  });
  
  return { ...project, ...updateData };
}

export async function deleteProject(id: string): Promise<boolean> {
  const collection = await getProjectsCollection();
  const project = await getProjectById(id);
  
  if (!project) return false;
  
  const query = project._id instanceof ObjectId 
    ? { _id: project._id } 
    : { id: project.id };
  
  const result = await collection.deleteOne(query);
  return result.deletedCount > 0;
}

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
}; 