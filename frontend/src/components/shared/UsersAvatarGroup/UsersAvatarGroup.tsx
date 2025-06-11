import React, { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import type { Member } from '@/app/concepts/projects/project-list/types'

interface UsersAvatarGroupProps extends ComponentPropsWithRef<'div'> {
    users: Member[]
    maxCount?: number
}

const UsersAvatarGroup = forwardRef<HTMLDivElement, UsersAvatarGroupProps>(
    ({ users, maxCount = 4, className = '', ...rest }, ref) => {
        const displayUsers = users.slice(0, maxCount)
        const remainingCount = users.length - maxCount

        return (
            <div ref={ref} className={`flex -space-x-2 ${className}`} {...rest}>
                {displayUsers.map((user, index) => (
                    <Avatar
                        key={index}
                        src={user.img}
                        name={user.name}
                        size="sm"
                        className="border-2 border-white"
                    />
                ))}
                {remainingCount > 0 && (
                    <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500 bg-gray-100 rounded-full border-2 border-white">
                        +{remainingCount}
                    </div>
                )}
            </div>
        )
    }
)

UsersAvatarGroup.displayName = 'UsersAvatarGroup'

export default UsersAvatarGroup 