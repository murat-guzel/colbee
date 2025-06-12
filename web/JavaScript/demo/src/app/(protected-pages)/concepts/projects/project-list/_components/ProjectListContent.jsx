'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import Link from 'next/link'
import ProgressionBar from './ProgressionBar'
import { useProjectListStore } from '../_store/projectListStore'
import { TbClipboardCheck, TbStarFilled, TbStar } from 'react-icons/tb'
import { fetchProjects } from '../_api/projectApi'

const ProjectCard = ({ project, isFavorite, onToggleFavorite }) => {
    if (!project?.id) {
        return null;
    }

    const commonContent = (
        <>
            <div className="flex items-center px-2 py-1 border border-gray-300 rounded-full">
                <TbClipboardCheck className="text-base" />
                <span className="ml-1 rtl:mr-1 whitespace-nowrap">
                    {project.completedTask || 0} / {project.totalTask || 0}
                </span>
            </div>
            <ProgressionBar progression={project.progression || 0} />
            <UsersAvatarGroup users={project.member || []} />
        </>
    );

    if (isFavorite) {
        return (
            <Card bodyClass="h-full">
                <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between items-center">
                        <Link href={`/concepts/projects/project-details/${project.id}`}>
                            <h6 className="font-bold hover:text-primary">{project.name}</h6>
                        </Link>
                        <div
                            className="text-amber-400 cursor-pointer text-lg"
                            role="button"
                            onClick={() => onToggleFavorite(project.id, false)}
                        >
                            <TbStarFilled />
                        </div>
                    </div>
                    <p className="mt-4">{project.desc}</p>
                    <div className="mt-3">
                        {commonContent}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="grid gap-x-4 grid-cols-12">
                <div className="my-1 sm:my-0 col-span-12 sm:col-span-2 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                    <div className="flex flex-col">
                        <h6 className="font-bold hover:text-primary">
                            <Link href={`/concepts/projects/project-details/${project.id}`}>
                                {project.name}
                            </Link>
                        </h6>
                        <span>{project.category}</span>
                    </div>
                </div>
                <div className="my-1 sm:my-0 col-span-12 sm:col-span-8 md:col-span-8 lg:col-span-8 md:flex md:items-center md:justify-between">
                    {commonContent}
                </div>
                <div className="my-1 sm:my-0 col-span-12 sm:col-span-1 flex md:items-center justify-end">
                    <div
                        className="cursor-pointer text-lg"
                        role="button"
                        onClick={() => onToggleFavorite(project.id, true)}
                    >
                        <TbStar />
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ProjectListContent = () => {
    const { projectList, setProjectList, updateProjectFavorite } = useProjectListStore();
    const [error, setError] = useState(null);

    // Fallback: If no projects from server, fetch client-side
    useEffect(() => {
        if (!projectList || projectList.length === 0) {
            const loadProjects = async () => {
                try {
                    const projects = await fetchProjects();
                    if (Array.isArray(projects) && projects.length > 0) {
                        setProjectList(projects);
                    }
                } catch (error) {
                    setError(error.message);
                }
            };
            loadProjects();
        }
    }, [projectList, setProjectList]);

    const getProjectKey = (project, prefix) => {
        if (!project) {
            return `${prefix}-invalid-project-${Date.now()}`;
        }
        
        if (project.id) {
            return `${prefix}-${project.id}`;
        }
        
        const timestamp = Date.now();
        const uniqueKey = [
            project.name || 'unnamed',
            project.category || 'uncategorized',
            project.totalTask || 0,
            project.completedTask || 0,
            timestamp
        ].join('-');
        
        return `${prefix}-${uniqueKey}`;
    }

    const safeProjectList = Array.isArray(projectList) ? projectList : [];
    
    const favoriteProjects = safeProjectList.filter(project => {
        if (!project || !project.id) {
            return false;
        }
        return project.favourite;
    });

    const otherProjects = safeProjectList.filter(project => {
        if (!project || !project.id) {
            return false;
        }
        return !project.favourite;
    });

    if (error) {
        return (
            <div className="text-center mt-8 text-red-500">
                <p>Error loading projects: {error}</p>
            </div>
        );
    }

    return (
        <div>
            {favoriteProjects.length > 0 && (
                <div className="mt-8">
                    <h5 className="mb-3">Favorite</h5>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteProjects.map(project => (
                            <div key={getProjectKey(project, 'favorite')}>
                                <ProjectCard
                                    project={project}
                                    isFavorite={true}
                                    onToggleFavorite={updateProjectFavorite}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {otherProjects.length > 0 && (
                <div className="mt-8">
                    <h5 className="mb-3">Other projects</h5>
                    <div className="flex flex-col gap-4">
                        {otherProjects.map(project => (
                            <div key={getProjectKey(project, 'other')}>
                                <ProjectCard
                                    project={project}
                                    isFavorite={false}
                                    onToggleFavorite={updateProjectFavorite}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {projectList.length === 0 && (
                <div className="text-center mt-8">
                    <p>No projects found.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectListContent;
