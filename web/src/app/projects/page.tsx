'use client'

import { ProjectList } from '@/components/projects/ProjectList'

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
          Create project
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-medium mb-6">Favorite</h2>
        <ProjectList type="favorite" />
      </section>

      <section>
        <h2 className="text-xl font-medium mb-6">Other projects</h2>
        <ProjectList type="other" />
      </section>
    </div>
  )
} 