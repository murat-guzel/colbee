'use client'

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="mt-2 text-gray-600">Manage and track all your projects in one place</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Project cards will go here */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Website Redesign</h3>
          <p className="mt-2 text-sm text-gray-600">Complete overhaul of the company website</p>
          <div className="mt-4">
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 