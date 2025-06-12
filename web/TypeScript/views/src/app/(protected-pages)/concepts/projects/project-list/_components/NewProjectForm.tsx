'use client'

import { useState } from 'react'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import hooks from '@/components/ui/hooks'
import NewTaskField from './NewTaskField'
import { useProjectListStore } from '../_store/projectListStore'
import { useForm, Controller } from 'react-hook-form'
import sleep from '@/utils/sleep'
import { TbChecks } from 'react-icons/tb'
import { components } from 'react-select'
import cloneDeep from 'lodash/cloneDeep'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { MultiValueGenericProps, OptionProps } from 'react-select'

type FormSchema = {
    ProjectName: string
    Description: string
    assignees: {
        value: string
        label: string
        img: string
    }[]
}

const { MultiValueLabel } = components

const { useUniqueId } = hooks

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<any>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <Avatar shape="circle" size={20} src={data.img} />
                <span className="font-semibold heading-text">{label}</span>
            </div>
            {isSelected && <TbChecks className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControlMulti = ({
    children,
    ...props
}: MultiValueGenericProps<any>) => {
    const { img } = props.data

    return (
        <MultiValueLabel {...props}>
            <div className="inline-flex items-center">
                <Avatar
                    className="mr-2 rtl:ml-2"
                    shape="circle"
                    size={15}
                    src={img}
                />
                {children}
            </div>
        </MultiValueLabel>
    )
}

const validationSchema: ZodType<FormSchema> = z.object({
    ProjectName: z.string().min(1, { message: 'Project name required' }),
    Description: z.string().min(1, { message: 'Description required' }),
    assignees: z.array(
        z.object({ value: z.string(), label: z.string(), img: z.string() }),
    ),
})

const NewProjectForm = ({ onClose }: { onClose: () => void }) => {
    const { memberList, updateProjectList } = useProjectListStore()
    const [isSubmitting, setSubmitting] = useState(false)

    const newId = useUniqueId()

    const [taskCount, setTaskCount] = useState<{
        totalTask?: number
        completedTask?: number
    }>({})

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            ProjectName: '',
            Description: '',
            assignees: [],
        },
        resolver: zodResolver(validationSchema),
    })

    const handleAddNewTask = (count: {
        totalTask?: number
        completedTask?: number
    }) => {
        setTaskCount(count)
    }

    const onSubmit = async (formValue: FormSchema) => {
        try {
            setSubmitting(true)
            const { ProjectName, Description, assignees } = formValue

            const { totalTask, completedTask } = taskCount

            const member = assignees.map((assignee) => ({
                name: assignee.label,
                img: assignee.img,
            }))

            const values = {
                id: newId,
                ProjectName,
                Description,
                totalTask: totalTask || 0,
                completedTask: completedTask || 0,
                progression: totalTask ? ((completedTask || 0) / totalTask) * 100 : 0,
                member,
            }

            const response = await fetch('http://localhost:3001/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to create project: ${response.status} - ${errorText}`)
            }

            const newProject = await response.json()
            updateProjectList(newProject)
            await sleep(500)
            onClose()
        } catch (error) {
            console.error('Error creating project:', error instanceof Error ? error.message : 'Unknown error')
            if (error instanceof Error) {
                // Handle specific error cases here if needed
                console.error('Error details:', error)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
                label="Project Name"
                invalid={Boolean(errors.ProjectName)}
                errorMessage={errors.ProjectName?.message}
            >
                <Controller
                    name="ProjectName"
                    control={control}
                    render={({ field }) => (
                        <Input type="text" autoComplete="off" {...field} />
                    )}
                />
            </FormItem>
            <FormItem
                label="Assignees"
                invalid={Boolean(errors.assignees)}
                errorMessage={errors.assignees?.message}
            >
                <Controller
                    name="assignees"
                    control={control}
                    render={({ field }) => (
                        <Select
                            isMulti
                            instanceId="assignees"
                            className="min-w-[120px]"
                            components={{
                                Option: CustomSelectOption,
                                MultiValueLabel: CustomControlMulti,
                            }}
                            value={field.value}
                            options={memberList}
                            onChange={field.onChange}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Description"
                invalid={Boolean(errors.Description)}
                errorMessage={errors.Description?.message}
            >
                <Controller
                    name="Description"
                    control={control}
                    render={({ field }) => (
                        <Input textArea autoComplete="off" {...field} />
                    )}
                />
            </FormItem>
            <NewTaskField onAddNewTask={handleAddNewTask} />
            <Button block variant="solid" type="submit" loading={isSubmitting}>
                Submit
            </Button>
        </Form>
    )
}

export default NewProjectForm
