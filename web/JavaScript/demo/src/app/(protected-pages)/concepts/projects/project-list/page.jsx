import ProjectListProvider from './_components/ProjectListProvider'
import ProjectListHeader from './_components/ProjectListHeader'
import ProjectListContent from './_components/ProjectListContent'
import getSrcumboardMembers from '@/server/actions/getSrcumboardMembers'

export default async function Page() {
    try {
        // Fetch projects from our MongoDB API
        const response = await fetch('http://localhost:3001/projects', {
            cache: 'no-store'
        });

        if (!response.ok) {
            return <div>Error loading projects. Please try again later.</div>;
        }

        const mongoProjects = await response.json();

        if (!Array.isArray(mongoProjects)) {
            return <div>Error: Invalid project data received</div>;
        }

        // Basic validation of MongoDB data
        const projectList = mongoProjects
            .filter(project => project && (project._id || project.id))
            .map(project => ({
                id: project._id?.toString() || project.id,
                name: project.ProjectName || project.name || 'Unnamed Project',
                category: project.category || 'Project',
                desc: project.Description || project.desc || 'No description',
                attachmentCount: Number(project.attachmentCount) || 0,
                totalTask: Number(project.totalTask) || 0,
                completedTask: Number(project.completedTask) || 0,
                progression: Number(project.progression) || 0,
                dayleft: Number(project.dayleft) || 30,
                favourite: Boolean(project.favourite),
                member: Array.isArray(project.member) ? project.member : []
            }));

        const projectMembers = await getSrcumboardMembers();

        return (
            <ProjectListProvider
                projectList={projectList}
                projectMembers={projectMembers}
            >
                <div>
                    <ProjectListHeader />
                    <ProjectListContent />
                </div>
            </ProjectListProvider>
        );
    } catch (error) {
        return <div>An unexpected error occurred. Please try again later.</div>;
    }
}
