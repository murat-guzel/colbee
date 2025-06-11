import { create } from 'zustand'
import type { ProjectList, Project, MemberListOption } from '../types'

export type ProjectListState = {
    projectList: ProjectList
    memberList: MemberListOption[]
    newProjectDialog: boolean
}

type ProjectListAction = {
    setProjectList: (payload: ProjectList) => void
    updateProjectList: (payload: Project) => void
    updateProjectFavorite: (payload: { id: string; value: boolean }) => void
    setMembers: (payload: MemberListOption[]) => void
    setDialogOpen: (open: boolean) => void
}

type ProjectListStore = ProjectListState & ProjectListAction

export const useProjectListStore = create<ProjectListStore>((set, get) => ({
    projectList: [],
    memberList: [],
    newProjectDialog: false,
    setProjectList: (payload) => {
        set((state) => ({
            ...state,
            projectList: payload,
        }))
    },
    updateProjectList: (payload) => {
        set((state) => ({
            ...state,
            projectList: [...state.projectList, payload],
            newProjectDialog: false,
        }))
    },
    updateProjectFavorite: (payload) => {
        const { id, value } = payload
        set((state) => ({
            ...state,
            projectList: state.projectList.map((project) => {
                if (project.id === id) {
                    return {
                        ...project,
                        favorite: value
                    }
                }
                return project
            }),
        }))
    },
    setMembers: (payload) => {
        set((state) => ({
            ...state,
            memberList: payload,
        }))
    },
    setDialogOpen: (open) => {
        set((state) => ({
            ...state,
            newProjectDialog: open,
        }))
    },
})) 