'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'solid' | 'outline' | 'plain'
    className?: string
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    variant = 'plain',
    className = '',
    children,
    ...props
}) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none'
    const variantClasses = {
        solid: 'bg-primary text-white hover:bg-primary-dark',
        outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
        plain: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button 