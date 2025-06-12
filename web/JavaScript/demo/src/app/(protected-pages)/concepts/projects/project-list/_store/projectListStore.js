import { create } from 'zustand'

const validateProject = (project) => {
    if (!project) {
        return null;
    }

    // Ensure project has an ID
    const id = project._id?.toString() || project.id;
    if (!id) {
        return null;
    }

    // Create validated project with default values
    const validatedProject = {
        id,
        name: project.ProjectName || project.name || 'Unnamed Project',
        category: project.category || 'Project',
        desc: project.Description || project.desc || 'No description',
        attachmentCount: Number(project.attachmentCount) || 0,
        totalTask: Number(project.totalTask) || 0,
        completedTask: Number(project.completedTask) || 0,
        progression: Number(project.progression) || 0,
        dayleft: Number(project.dayleft) || 30,
        favourite: Boolean(project.favourite),
        member: Array.isArray(project.member) ? project.member : []
    };

    return validatedProject;
};

const useProjectListStore = create((set) => ({
    projectList: [],
    members: [],
    setProjectList: (list) => {
        if (!Array.isArray(list)) {
            set({ projectList: [] });
            return;
        }
        
        // Validate and clean each project
        const validatedList = list
            .map(validateProject)
            .filter(Boolean); // Remove null entries
        
        set({ projectList: validatedList });
    },
    setMembers: (members) => {
        if (!Array.isArray(members)) {
            set({ members: [] });
            return;
        }
        set({ members });
    },
    updateProjectFavorite: (id, value) => {
        if (!id) {
            return;
        }
        
        set((state) => {
            const updatedList = state.projectList.map((project) => {
                if (project.id === id) {
                    return { ...project, favourite: Boolean(value) };
                }
                return project;
            });
            
            return { projectList: updatedList };
        });
    },
}));

export { useProjectListStore };
