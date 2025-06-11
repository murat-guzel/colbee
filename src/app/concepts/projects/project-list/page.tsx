import ProjectListHeader from './_components/ProjectListHeader'
import ProjectListContent from './_components/ProjectListContent'
import ProjectListProvider from './_components/ProjectListProvider'
import { getProjects } from '@/server/actions/projects'
import { getProjectMembers } from '@/server/actions/members'

export default async function Page() {
    const projectList = await getProjects()
    const projectMembers = await getProjectMembers()

    return (
        <ProjectListProvider projectList={projectList} projectMembers={projectMembers}>
            <ProjectListHeader />
            <ProjectListContent />
        </ProjectListProvider>
    )
} 