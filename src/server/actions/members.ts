import type { ProjectMembers } from '@/app/concepts/projects/project-list/types'

export async function getProjectMembers(): Promise<ProjectMembers> {
    // TODO: Replace with actual API call
    return {
        participantMembers: [],
        allMembers: [
            {
                id: '1',
                name: 'John Doe',
                img: '/avatars/john.jpg'
            }
        ]
    }
} 