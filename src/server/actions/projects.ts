import type { Project } from '@/app/concepts/projects/project-list/types'

export async function getProjects(): Promise<Project[]> {
    // TODO: Replace with actual API call
    return [
        {
            id: '1',
            name: 'Project 1',
            desc: 'Project 1 description',
            totalTask: 10,
            completedTask: 5,
            progression: 50,
            members: [],
            favorite: false,
            category: 'Development'
        }
    ]
} 