import React from 'react'

interface ProgressProps {
    value: number
    className?: string
    color?: 'primary' | 'success' | 'warning' | 'danger'
}

const Progress = ({ value, className = '', color = 'primary' }: ProgressProps) => {
    const colors = {
        primary: 'bg-indigo-600',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500'
    }

    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div
                className={`${colors[color]} h-2 rounded-full transition-all duration-300 ease-in-out`}
                style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
            />
        </div>
    )
}

export default Progress 