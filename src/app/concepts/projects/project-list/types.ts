export interface Member {
    id: string
    name: string
    img?: string
}

export interface MemberListOption {
    value: string
    label: string
    img?: string
}

export interface Project {
    id: string
    name: string
    desc: string
    totalTask: number
    completedTask: number
    progression: number
    members: Member[]
    category?: string
    favourite?: boolean
}

export type ProjectList = Project[]

export interface ProjectMembers {
    participantMembers: Member[]
    allMembers: Member[]
} 