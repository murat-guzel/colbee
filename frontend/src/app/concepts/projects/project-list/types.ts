export interface Member {
    name: string
    img?: string
    id?: string
}

export interface MemberListOption {
    label: string
    value: string
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
    status: string
    dueDate: string
}

export type ProjectList = Project[]

export interface ProjectMembers {
    participantMembers: Member[]
    allMembers: Member[]
} 