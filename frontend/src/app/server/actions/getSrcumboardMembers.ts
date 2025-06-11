import { ProjectMembers } from '@/app/concepts/projects/project-list/types'

export default async function getSrcumboardMembers(): Promise<ProjectMembers> {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
        participantMembers: [
            { id: '1', name: 'John Doe', img: 'https://i.pravatar.cc/150?img=1' },
            { id: '2', name: 'Jane Smith', img: 'https://i.pravatar.cc/150?img=2' }
        ],
        allMembers: [
            { id: '1', name: 'John Doe', img: 'https://i.pravatar.cc/150?img=1' },
            { id: '2', name: 'Jane Smith', img: 'https://i.pravatar.cc/150?img=2' },
            { id: '3', name: 'Alice Johnson', img: 'https://i.pravatar.cc/150?img=3' },
            { id: '4', name: 'Bob Wilson', img: 'https://i.pravatar.cc/150?img=4' }
        ]
    }
} 