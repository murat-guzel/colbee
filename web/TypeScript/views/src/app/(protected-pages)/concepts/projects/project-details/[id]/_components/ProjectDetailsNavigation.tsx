'use client'

import classNames from '@/utils/classNames'
import {
    TbBraces,
    TbChecklist,
    TbSettings,
    TbCalendarStats,
    TbPaperclip,
} from 'react-icons/tb'

type ProjectDetailsNavigationProps = {
    selected: string
    onChange: (value: string) => void
}

const navigation = [
    { label: 'API Contract', value: 'overview', icon: <TbBraces /> },
    { label: 'Tasks', value: 'tasks', icon: <TbChecklist /> },
    { label: 'Attachments', value: 'attachments', icon: <TbPaperclip /> },
    { label: 'Activities', value: 'activity', icon: <TbCalendarStats /> },
    { label: 'Settings', value: 'settings', icon: <TbSettings /> },
]

const ProjectDetailsNavigation = ({
    selected,
    onChange,
}: ProjectDetailsNavigationProps) => {
    const handleClick = (value: string) => {
        onChange(value)
    }

    return (
        <div className="w-full">
            <div className="flex flex-row gap-2 overflow-x-auto pb-2">
                {navigation.map((nav) => (
                    <div key={nav.value} className="flex-shrink-0">
                        <button
                            className={classNames(
                                'flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-transparent font-semibold transition-colors dark:hover:text-gray-100 text-gray-900 dark:text-white whitespace-nowrap',
                                selected === nav.value
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                            )}
                            onClick={() => handleClick(nav.value)}
                        >
                            <span className="text-xl">{nav.icon}</span>
                            <span>{nav.label}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectDetailsNavigation
