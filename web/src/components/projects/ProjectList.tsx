import { useState } from 'react'
import { ProjectCard } from './ProjectCard'

export type Project = {
  id: string
  name: string
  description: string
  progress: number
  members: string[]
  isFavorite: boolean
  tasks: {
    total: number
    completed: number
  }
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'EVO SaaS',
    description: 'Most of you are familiar with the virtues of a programmer',
    progress: 80,
    members: ['thumb-1.jpg', 'thumb-2.jpg'],
    isFavorite: true,
    tasks: {
      total: 32,
      completed: 27
    }
  },
  {
    id: '2',
    name: 'AIA Bill App',
    description: 'We are not shipping your machine!',
    progress: 45,
    members: ['thumb-3.jpg'],
    isFavorite: true,
    tasks: {
      total: 36,
      completed: 15
    }
  },
  {
    id: '3',
    name: 'Octonine POS',
    description: 'Everything that can be invented has been invented.',
    progress: 21,
    members: ['thumb-4.jpg', 'thumb-5.jpg', 'thumb-6.jpg', 'thumb-7.jpg'],
    isFavorite: true,
    tasks: {
      total: 78,
      completed: 23
    }
  },
  {
    id: '4',
    name: 'Evo SaaS API',
    description: 'Debugging is twice as hard as writing the code in the first place.',
    progress: 87,
    members: ['thumb-8.jpg'],
    isFavorite: true,
    tasks: {
      total: 15,
      completed: 13
    }
  },
  {
    id: '5',
    name: 'IOP Web',
    description: 'Web Backend Application',
    progress: 73,
    members: ['thumb-9.jpg', 'thumb-10.jpg'],
    isFavorite: false,
    tasks: {
      total: 27,
      completed: 19
    }
  },
  {
    id: '6',
    name: 'Posiflex Web',
    description: 'Frontend Web Application',
    progress: 50,
    members: ['thumb-11.jpg'],
    isFavorite: false,
    tasks: {
      total: 18,
      completed: 9
    }
  },
  {
    id: '7',
    name: 'FoksMart APP',
    description: 'Mobile Application',
    progress: 67,
    members: ['thumb-12.jpg', 'thumb-13.jpg'],
    isFavorite: false,
    tasks: {
      total: 26,
      completed: 19
    }
  },
  {
    id: '8',
    name: 'FlowBuzz SEO',
    description: 'Marketing',
    progress: 88,
    members: ['thumb-14.jpg', 'thumb-15.jpg'],
    isFavorite: false,
    tasks: {
      total: 26,
      completed: 19
    }
  },
  {
    id: '9',
    name: 'Mind Blast APP',
    description: 'Mobile Application',
    progress: 42,
    members: ['thumb-1.jpg', 'thumb-2.jpg'],
    isFavorite: false,
    tasks: {
      total: 74,
      completed: 31
    }
  }
]

type ProjectListProps = {
  type: 'favorite' | 'other'
}

export function ProjectList({ type }: ProjectListProps) {
  const [projects] = useState<Project[]>(mockProjects)
  const filteredProjects = projects.filter(project => 
    type === 'favorite' ? project.isFavorite : !project.isFavorite
  )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
} 