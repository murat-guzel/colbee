'use client'

import { useState, lazy, Suspense } from 'react'
import Spinner from '@/components/ui/Spinner'
import ProjectDetailsHeader from './ProjectDetailsHeader'
import ProjectDetailsNavigation from './ProjectDetailsNavigation'
import useResponsive from '@/utils/hooks/useResponsive'

const defaultNavValue = 'overview'
const settingsNavValue = 'settings'

const ProjectDetailsOverview = lazy(() => import('./ProjectDetailsOverview'))
const ProjectDetailsTask = lazy(() => import('./ProjectDetailsTask'))
const ProjectDetailsAttachments = lazy(() => import('./ProjectDetailsAttachments'))
const ProjectDetailsActivity = lazy(() => import('./ProjectDetailsActivity'))
const ProjectDetailsSetting = lazy(() => import('./ProjectDetailsSetting'))

// Örnek statik veri
const mockProjectData = {
    id: '1',
    name: 'Proje Adı',
    content: '',
    client: {
        clientName: 'Müşteri Adı',
        skateHolder: {
            name: 'Ahmet Yılmaz',
            img: '/img/avatars/thumb-1.jpg'
        },
        projectManager: {
            name: 'Mehmet Demir',
            img: '/img/avatars/thumb-2.jpg'
        }
    },
    schedule: {
        startDate: Date.now(),
        dueDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 gün sonrası
        status: 'active',
        completion: 75
    },
    members: [
        { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Yöneticisi' },
        { id: '2', name: 'Mehmet Demir', role: 'Geliştirici' }
    ]
}

const ProjectDetails = ({ id }: { id: string }) => {
    const { larger } = useResponsive()
    const [selectedNav, setSelectedNav] = useState(defaultNavValue)
    const [isContentEdit, setIsContentEdit] = useState(false)
    const [projectData, setProjectData] = useState(mockProjectData)

    const handleEdit = (isEdit: boolean) => {
        setSelectedNav(settingsNavValue)
        setIsContentEdit(isEdit)
    }

    const handleContentChange = (content: string) => {
        setProjectData(prev => ({ ...prev, content }))
        setIsContentEdit(false)
    }

    const handleUpdate = ({
        name,
        content,
        dueDate,
    }: {
        name: string
        content: string
        dueDate: number
    }) => {
        setProjectData(prev => ({
            ...prev,
            name,
            content,
            schedule: {
                ...prev.schedule,
                dueDate
            }
        }))
        setIsContentEdit(false)
        setSelectedNav(defaultNavValue)
    }

    const handleNavigationChange = (val: string) => {
        if (val === settingsNavValue) {
            setIsContentEdit(true)
        } else {
            setIsContentEdit(false)
        }
        setSelectedNav(val)
    }

    return (
        <div>
            <ProjectDetailsHeader
                title={projectData.name}
                isContentEdit={isContentEdit}
                selected={selectedNav}
                onEdit={handleEdit}
                onChange={handleNavigationChange}
            />
            <div className="mt-6 flex gap-12">
                {larger.xl && (
                    <ProjectDetailsNavigation
                        selected={selectedNav}
                        onChange={handleNavigationChange}
                    />
                )}
                <div className="w-full">
                    <Suspense
                        fallback={
                            <div className="my-4 mx-auto text-center flex justify-center">
                                <Spinner size={40} />
                            </div>
                        }
                    >
                        {selectedNav === defaultNavValue && (
                            <ProjectDetailsOverview
                                content={projectData.content}
                                client={projectData.client}
                                schedule={projectData.schedule}
                                isContentEdit={isContentEdit}
                                setIsContentEdit={setIsContentEdit}
                                onContentChange={handleContentChange}
                            />
                        )}
                        {selectedNav === 'tasks' && (
                            <ProjectDetailsTask />
                        )}
                        {selectedNav === 'attachments' && (
                            <ProjectDetailsAttachments />
                        )}
                        {selectedNav === 'activity' && (
                            <ProjectDetailsActivity />
                        )}
                        {selectedNav === 'settings' && (
                            <ProjectDetailsSetting
                                name={projectData.name}
                                content={projectData.content}
                                dueDate={projectData.schedule.dueDate}
                                onUpdate={handleUpdate}
                            />
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails
