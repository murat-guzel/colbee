import React, { useState } from 'react'
import Button from '@/components/ui/Button'

export interface TaskCount {
    totalTask: number
    completedTask: number
}

interface NewTaskFieldProps {
    onAddNewTask: (count: TaskCount) => void
}

const NewTaskField = ({ onAddNewTask }: NewTaskFieldProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [taskCount, setTaskCount] = useState<TaskCount>({
        totalTask: 0,
        completedTask: 0
    })

    const handleAddTask = () => {
        onAddNewTask(taskCount)
        setIsEditing(false)
    }

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Tasks</h4>
            {isEditing ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Tasks</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={taskCount.totalTask}
                                onChange={(e) => setTaskCount(prev => ({ ...prev, totalTask: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Completed Tasks</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={taskCount.completedTask}
                                onChange={(e) => setTaskCount(prev => ({ ...prev, completedTask: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddTask}>
                            Add
                        </Button>
                    </div>
                </div>
            ) : (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                    Add Tasks
                </Button>
            )}
        </div>
    )
}

export default NewTaskField 