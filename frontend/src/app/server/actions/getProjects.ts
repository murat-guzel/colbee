import { Project } from '@/app/concepts/projects/project-list/types'

export default async function getProjects(): Promise<Project[]> {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    return [
        {
            id: '1',
            name: 'Website Redesign',
            desc: 'Redesign and implement new website features',
            totalTask: 8,
            completedTask: 5,
            progression: 62.5,
            members: [
                { name: 'John Doe', img: 'https://i.pravatar.cc/150?img=1' },
                { name: 'Jane Smith', img: 'https://i.pravatar.cc/150?img=2' }
            ],
            status: 'In Progress',
            dueDate: '2024-03-15'
        },
        {
            id: '2',
            name: 'Mobile App Development',
            desc: 'Develop a new mobile application',
            totalTask: 12,
            completedTask: 3,
            progression: 25,
            members: [
                { name: 'Alice Johnson', img: 'https://i.pravatar.cc/150?img=3' },
                { name: 'Bob Wilson', img: 'https://i.pravatar.cc/150?img=4' }
            ],
            status: 'Planning',
            dueDate: '2024-04-30'
        }
    ]
} 