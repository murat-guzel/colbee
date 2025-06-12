import ProjectService from '@/services/ProjectService';
import { ProjectList } from '@/app/(protected-pages)/concepts/projects/project-list/types';

export default async function getProjects(): Promise<ProjectList> {
    try {
        return await ProjectService.getProjects();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}
