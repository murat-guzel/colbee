'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    textArea?: boolean
    className?: string
}

const Input: React.FC<InputProps> = ({
    textArea = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white'

    if (textArea) {
        return (
            <textarea
                className={`${baseClasses} ${className}`}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
        )
    }

    return (
        <input
            className={`${baseClasses} ${className}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
    )
}

export default Input 