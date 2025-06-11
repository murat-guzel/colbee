import React from 'react'

interface AvatarProps {
    src?: string
    name?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const Avatar = ({ src, name, size = 'md', className = '' }: AvatarProps) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const baseClass = 'inline-flex items-center justify-center rounded-full bg-gray-500 text-white'

    if (!src && !name) {
        return (
            <div className={`${baseClass} ${sizes[size]} ${className}`}>
                <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>
        )
    }

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'avatar'}
                className={`${baseClass} ${sizes[size]} ${className}`}
            />
        )
    }

    return (
        <div className={`${baseClass} ${sizes[size]} ${className}`}>
            {name && getInitials(name)}
        </div>
    )
}

export default Avatar

 