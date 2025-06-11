import { useState } from 'react'
import { ProjectCard } from './ProjectCard'

type Project = {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  dueDate: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design',
    status: 'active',
    progress: 65,
    dueDate: '2024-03-15',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile app for iOS and Android platforms',
    status: 'on-hold',
    progress: 30,
    dueDate: '2024-04-20',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 digital marketing campaign across social media',
    status: 'completed',
    progress: 100,
    dueDate: '2024-02-28',
  },
]

export function ProjectList() {
  const [projects] = useState<Project[]>(mockProjects)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
} 