'use client'

import { useState, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { apiGetProjectMembers } from '@/services/ProjectService'
import { components } from 'react-select'
import { TbChecks } from 'react-icons/tb'
import useSWRMutation from 'swr/mutation'
import type { MultiValueGenericProps, OptionProps } from 'react-select'

type ProjectDetailsHeaderProps = {
    title: string
    client: Partial<{
        clientName: string
        skateHolder: {
            name: string
            img: string
        }
        projectManager: {
            name: string
            img: string
        }
    }>
    isContentEdit: boolean
    onEdit: (value: boolean) => void
    selected: string
    onChange: (value: string) => void
}

type Member = {
    id: string
    name: string
    img: string
}

type MemberOption = {
    label: string
    value: string
    img: string
}

type GetProjectMembersResponse = {
    participantMembers: Member[]
    allMembers: Member[]
}

const { MultiValueLabel } = components

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<MemberOption>) => {
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

const CustomControlMulti = ({ children, ...props }: MultiValueGenericProps) => {
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

const ProjectDetailsHeader = (props: ProjectDetailsHeaderProps) => {
    const { title, client, isContentEdit, onEdit } = props

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [memberOptions, setMemberOptions] = useState<MemberOption[]>([])

    const { trigger } = useSWRMutation(
        ['/api/projects/members'],
        () => apiGetProjectMembers<GetProjectMembersResponse>(),
        {
            onSuccess: (data) => {
                const members = data?.allMembers.map((item) => ({
                    value: item.id,
                    label: item.name,
                    img: item.img,
                }))
                setMemberOptions(members)
            },
        },
    )

    const handleFocus = async () => {
        if (memberOptions.length === 0) {
            setLoading(true)
            await trigger()
            setLoading(false)
        }
    }

    useEffect(() => {
        if (copied) {
            const copyFeedbackInterval = setTimeout(
                () => setCopied(false),
                2000,
            )

            return () => {
                clearTimeout(copyFeedbackInterval)
            }
        }
    }, [copied])

    return (
        <>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 mb-6 pb-4">
                <div className="flex items-center gap-6">
                    <h3>{title}</h3>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                                Client:
                            </span>
                            <span className="font-semibold">
                                {client.clientName}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                                Stakeholder:
                            </span>
                            <div className="flex items-center gap-1">
                                <Avatar
                                    size={20}
                                    src={client.skateHolder?.img}
                                    alt=""
                                />
                                <span className="font-semibold">
                                    {client.skateHolder?.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                                Manager:
                            </span>
                            <div className="flex items-center gap-1">
                                <Avatar
                                    size={20}
                                    src={client.projectManager?.img}
                                    alt=""
                                />
                                <span className="font-semibold">
                                    {client.projectManager?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsDialogOpen(true)}>Share</Button>
                    <Button
                        disabled={isContentEdit}
                        variant="solid"
                        onClick={() => onEdit(!isContentEdit)}
                    >
                        {isContentEdit ? 'Editing' : 'Edit'}
                    </Button>
                </div>
            </div>
            <Dialog
                isOpen={isDialogOpen}
                width={640}
                onClose={() => setIsDialogOpen(false)}
                onRequestClose={() => setIsDialogOpen(false)}
            >
                <h5>Share this project</h5>
                <Form className="my-6">
                    <FormItem label="Copy link">
                        <Input
                            readOnly
                            value="https://edge.themenate.net/concepts/projects/project-details/27"
                            suffix={
                                <Button
                                    type="button"
                                    variant="solid"
                                    size="sm"
                                    customColorClass={() =>
                                        'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200'
                                    }
                                    onClick={() => setCopied(true)}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            }
                        />
                    </FormItem>
                    <FormItem label="Or share to members">
                        <Select<MemberOption, true>
                            isMulti
                            instanceId="members"
                            className="min-w-[120px]"
                            components={{
                                Option: CustomSelectOption,
                                MultiValueLabel: CustomControlMulti,
                            }}
                            options={memberOptions}
                            isLoading={loading}
                            onFocus={handleFocus}
                        />
                    </FormItem>
                </Form>
                <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Share
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default ProjectDetailsHeader
