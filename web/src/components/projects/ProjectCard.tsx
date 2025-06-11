import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

type Project = {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  dueDate: string
}

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <p className="mt-2 text-sm text-gray-600">{project.description}</p>
        </div>
        <span
          className={clsx(
            'rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusColors[project.status]
          )}
        >
          {project.status}
        </span>
      </div>

      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <ChartBarIcon className="mr-1.5 h-4 w-4" />
          <span>{project.progress}% complete</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="mr-1.5 h-4 w-4" />
          <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
} 