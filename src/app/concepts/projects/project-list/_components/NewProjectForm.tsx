import React, { useState } from 'react'
import { TbChecks } from 'react-icons/tb'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import NewTaskField from './NewTaskField'
import type { Project, MemberListOption, Member } from '../types'
import type { TaskCount } from './NewTaskField'
import type { ZodType } from 'zod'

interface NewProjectFormProps {
    updateProjectList: (project: Project) => void
    member: MemberListOption[]
}

const MemberOption = ({ data, isSelected }: { data: MemberListOption; isSelected?: boolean }) => {
    const { label, img } = data

    return (
        <div
            className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
            aria-selected={isSelected}
        >
            <div className="flex items-center gap-2">
                <Avatar
                    className="mr-2 rtl:ml-2"
                    shape="circle"
                    size="sm"
                    src={img}
                />
                <span className="font-semibold heading-text">{label}</span>
            </div>
            {isSelected && <div className="text-emerald-500 text-xl"><TbChecks /></div>}
        </div>
    )
}

interface FormSchema {
    name: string
    desc: string
    assignees: MemberListOption[]
}

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    desc: z.string().min(1, { message: 'Description is required' }),
    assignees: z.array(z.object({
        value: z.string(),
        label: z.string(),
        img: z.string().optional()
    }))
})

const NewProjectForm = ({ updateProjectList, member }: NewProjectFormProps) => {
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [totalTask, setTotalTask] = useState(0)
    const [completedTask, setCompletedTask] = useState(0)

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name: '',
            desc: '',
            assignees: [],
        },
        resolver: zodResolver(validationSchema)
    })

    const handleAddNewTask = (count: TaskCount) => {
        setTotalTask(count.totalTask)
        setCompletedTask(count.completedTask)
    }

    const onSubmit = (values: FormSchema) => {
        setIsSubmiting(true)
        const newProject: Project = {
            id: Math.random().toString(36).slice(2),
            name: values.name,
            desc: values.desc,
            totalTask: totalTask,
            completedTask: completedTask,
            progression: (completedTask / totalTask) * 100 || 0,
            members: values.assignees.map(option => ({
                id: option.value,
                name: option.label,
                img: option.img
            }))
        }

        updateProjectList(newProject)
        setIsSubmiting(false)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
                label="Name"
                invalid={false}
                errorMessage=""
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            className="input"
                            type="text"
                            placeholder="Project Name"
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Description"
                invalid={false}
                errorMessage=""
            >
                <Controller
                    name="desc"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            className="input h-24"
                            placeholder="Project Description"
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Members"
                invalid={false}
                errorMessage=""
            >
                <Controller
                    name="assignees"
                    control={control}
                    render={({ field }) => (
                        <Select<MemberListOption, true>
                            isMulti
                            className="min-w-[120px]"
                            placeholder="Members"
                            options={member}
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <NewTaskField onAddNewTask={handleAddNewTask} />
            <Button variant="primary" type="submit" loading={isSubmiting} className="w-full">
                Create
            </Button>
        </Form>
    )
}

export default NewProjectForm 