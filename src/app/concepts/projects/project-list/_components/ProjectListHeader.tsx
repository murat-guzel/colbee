import { useProjectListStore } from '../_store/projectListStore'
import { Button } from '@/components/ui/Button'

const ProjectListHeader = () => {
    const { setDialogOpen } = useProjectListStore((state) => ({
        setDialogOpen: state.setDialogOpen,
    }))

    return (
        <div className="lg:flex items-center justify-between mb-4">
            <h3>Projects</h3>
            <div>
                <Button variant="primary" onClick={() => setDialogOpen(true)}>
                    Create project
                </Button>
            </div>
        </div>
    )
}

export default ProjectListHeader 