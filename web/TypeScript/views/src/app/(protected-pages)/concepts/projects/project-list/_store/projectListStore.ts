import { create } from 'zustand'
import type { ProjectList, Project, MemberListOption } from '../types'
import ProjectService from '@/services/ProjectService'

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
}

const initialState: ProjectListState = {
    projectList: [],
    memberList: [],
    newProjectDialog: false,
}

export const useProjectListStore = create<ProjectListState & ProjectListAction>(
    (set) => ({
        ...initialState,
        setProjectList: (payload) => set(() => ({ projectList: payload })),
        updateProjectList: (payload) =>
            set((state) => ({
                projectList: [...state.projectList, ...[payload]],
            })),
        updateProjectFavorite: async (payload) => {
            try {
                const { id } = payload;
                const updatedProject = await ProjectService.toggleProjectFavorite(id);
                
                set((state) => {
                    const newList = state.projectList.map((project) => {
                        if (project.id === id) {
                            return updatedProject;
                        }
                        return project;
                    });

                    return {
                        projectList: [...newList],
                    };
                });
            } catch (error) {
                console.error('Error updating project favorite:', error);
            }
        },
        setMembers: (payload) => set(() => ({ memberList: payload })),
    }),
)
