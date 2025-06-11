'use client'

import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import Link from 'next/link'
import ProgressionBar from './ProgressionBar'
import { useProjectListStore } from '../_store/projectListStore'
import { TbClipboardCheck, TbStarFilled, TbStar } from 'react-icons/tb'
import type { IconType } from 'react-icons'
import type { Project } from '../types'

const ProjectListContent = () => {
    const { projectList, updateProjectFavorite } = useProjectListStore(
        (state) => ({
            projectList: state.projectList,
            updateProjectFavorite: state.updateProjectFavorite,
        }),
    )

    return (
        <div>
            <div className="mt-8">
                {projectList?.filter((project) => project.favorite).length > 0 && (
                    <h5 className="mb-3">Favorite</h5>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projectList
                        ?.filter((project) => project.favorite)
                        .map((project) => (
                            <Card key={project.id} className="h-full">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/app/scrum-board?projectId=${project.id}&boardId=0`}
                                            className="hover:text-primary-500"
                                        >
                                            <h6>{project.name}</h6>
                                        </Link>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                updateProjectFavorite({
                                                    id: project.id,
                                                    value: false,
                                                })
                                            }
                                        >
                                            <TbStarFilled className="text-amber-500" />
                                        </div>
                                    </div>
                                    <p className="mt-4">{project.desc}</p>
                                    <div className="mt-3">
                                        <ProgressionBar
                                            progression={project.progression}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mt-2">
                                            <UsersAvatarGroup
                                                users={project.members}
                                            />
                                            <div className="flex items-center rounded-full font-semibold text-xs">
                                                <div className="flex items-center px-2 py-1 border border-gray-300 rounded-full">
                                                    <TbClipboardCheck className="text-base" />
                                                    <span className="ml-1 rtl:mr-1 whitespace-nowrap">
                                                        {project.completedTask}{' '}
                                                        / {project.totalTask}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                </div>
            </div>
            <div className="mt-8">
                {projectList?.filter((project) => !project.favorite).length >
                    0 && <h5 className="mb-3">Other projects</h5>}
                <div className="flex flex-col gap-4">
                    {projectList
                        ?.filter((project) => !project.favorite)
                        .map((project) => (
                            <Card key={project.id}>
                                <div className="grid gap-x-4 grid-cols-12">
                                    <div className="my-1 sm:my-0 col-span-12 md:col-span-3 lg:col-span-4 md:flex md:items-center">
                                        <div className="flex flex-col">
                                            <h6 className="font-bold">
                                                <Link
                                                    href={`/app/scrum-board?projectId=${project.id}&boardId=0`}
                                                    className="hover:text-primary-500"
                                                >
                                                    {project.name}
                                                </Link>
                                            </h6>
                                            <span>{project.category}</span>
                                        </div>
                                    </div>
                                    <div className="my-1 sm:my-0 col-span-12 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                        <div className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-full">
                                            <TbClipboardCheck className="text-base" />
                                            <span className="ml-1 rtl:mr-1 whitespace-nowrap">
                                                {project.completedTask} /{' '}
                                                {project.totalTask}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="my-1 sm:my-0 col-span-12 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                        <UsersAvatarGroup
                                            users={project.members}
                                        />
                                    </div>
                                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-1 flex md:items-center justify-end">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                updateProjectFavorite({
                                                    id: project.id,
                                                    value: true,
                                                })
                                            }
                                        >
                                            <TbStar className="text-amber-500" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectListContent 