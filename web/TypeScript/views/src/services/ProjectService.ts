import axios from 'axios';
import { Project, ProjectList } from '@/app/(protected-pages)/concepts/projects/project-list/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ProjectService {
    static async getProjects(): Promise<ProjectList> {
        const response = await axios.get(`${API_BASE_URL}/projects`);
        return response.data;
    }

    static async getProject(id: string): Promise<Project> {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        return response.data;
    }

    static async createProject(project: Omit<Project, 'id'>): Promise<Project> {
        const response = await axios.post(`${API_BASE_URL}/projects`, project);
        return response.data;
    }

    static async updateProject(id: string, project: Partial<Project>): Promise<Project> {
        const response = await axios.put(`${API_BASE_URL}/projects/${id}`, project);
        return response.data;
    }

    static async deleteProject(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/projects/${id}`);
    }

    static async toggleProjectFavorite(id: string): Promise<Project> {
        const response = await axios.patch(`${API_BASE_URL}/projects/${id}/favorite`);
        return response.data;
    }

    static async getProjectMembers<T>(): Promise<T> {
        const response = await axios.get(`${API_BASE_URL}/projects/members`);
        return response.data;
    }

    static async getScrumBoards<T>(): Promise<T> {
        const response = await axios.get(`${API_BASE_URL}/projects/scrum-boards`);
        return response.data;
    }
}

export default ProjectService;

// Named export for the getProject method to match the import in ProjectDetails.tsx
export const apiGetProject = ({ id }: { id: string }) => ProjectService.getProject(id);
export const apiGetProjectMembers = <T>() => ProjectService.getProjectMembers<T>();
export const apiGetScrumBoards = <T>() => ProjectService.getScrumBoards<T>();
