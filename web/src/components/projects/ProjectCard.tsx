import { StarIcon } from '@heroicons/react/24/solid'
import { type Project } from './ProjectList'
import Image from 'next/image'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description}</p>
        </div>
        {project.isFavorite && (
          <StarIcon className="h-5 w-5 text-amber-400" />
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">{project.progress}%</span>
          <span className="text-gray-500">
            {project.tasks.completed}/{project.tasks.total} tasks
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex -space-x-2 overflow-hidden">
        {project.members.map((member, index) => (
          <div
            key={index}
            className="relative h-8 w-8 rounded-full border-2 border-white ring-1 ring-gray-100"
          >
            <Image
              src={`/img/avatars/${member}`}
              alt={`Team member ${index + 1}`}
              fill
              className="rounded-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 