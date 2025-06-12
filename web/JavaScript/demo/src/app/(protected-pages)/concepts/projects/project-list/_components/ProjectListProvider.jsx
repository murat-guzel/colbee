'use client'
import { useEffect } from 'react'
import { useProjectListStore } from '../_store/projectListStore'

const ProjectListProvider = ({ children, projectList, projectMembers }) => {
    const setProjectList = useProjectListStore((state) => state.setProjectList)
    const setMembers = useProjectListStore((state) => state.setMembers)

    useEffect(() => {
        // Ensure projectList is an array and each project has an id
        if (Array.isArray(projectList)) {
            const validProjects = projectList.map(project => {
                if (!project) return null;
                
                // Ensure we have a valid ID
                const id = project._id?.toString() || project.id;
                if (!id) return null;

                return {
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
            }).filter(Boolean); // Remove null entries

            setProjectList(validProjects);
        }

        // Ensure members is properly formatted
        if (Array.isArray(projectMembers?.allMembers)) {
            const formattedMembers = projectMembers.allMembers.map(member => ({
                value: member.id,
                label: member.name,
                img: member.img
            }));
            setMembers(formattedMembers);
        }
    }, [projectList, projectMembers, setProjectList, setMembers])

    return <>{children}</>
}

export default ProjectListProvider
