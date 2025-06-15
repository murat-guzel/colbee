import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'

const ProjectDetailsOverview: React.FC = () => {
    const params = useParams()

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectId = params.id as string
                const response = await fetch(`/api/projects/${projectId}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch project details')
                }
                const projectDetails = await response.json()
            } catch (error) {
                console.error('Error fetching project details:', error)
            }
        }

        fetchProjectDetails()
    }, [params.id])

    return (
        <div>
            {/* Existing code */}
        </div>
    )
}

export default ProjectDetailsOverview 