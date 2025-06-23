'use client'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import signOut from '@/server/actions/auth/handleSignOut'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import {
    PiUserDuotone,
    PiGearDuotone,
    PiPulseDuotone,
    PiSignOutDuotone,
} from 'react-icons/pi'
import { apiGetUserProfile } from '@/services/ProfileService'
import useSWR from 'swr'

import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

type UserProfile = {
    id: string
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    profilePhotoUrl?: string
    country: string
    address: string
    postcode: string
    city: string
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',
        path: '/concepts/account/settings',
        icon: <PiUserDuotone />,
    },
    {
        label: 'Account Setting',
        path: '/concepts/account/settings',
        icon: <PiGearDuotone />,
    },
    {
        label: 'Activity Log',
        path: '/concepts/account/activity-log',
        icon: <PiPulseDuotone />,
    },
]

const _UserDropdown = () => {
    const { session } = useCurrentSession()
    const userId = session?.user?.id

    // Fetch current user profile data to get the latest profilePhotoUrl
    const { data: profileData } = useSWR<UserProfile>(
        userId ? `/api/profile/${userId}` : null,
        userId ? () => apiGetUserProfile<UserProfile>(userId) : null,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const handleSignOut = async () => {
        await signOut()
    }

    // Get the profile photo URL from the API response or fallback to session
    const getProfilePhotoUrl = () => {
        if (profileData?.profilePhotoUrl) {
            // If it's already a full URL, return as is
            if (profileData.profilePhotoUrl.startsWith('http')) {
                return profileData.profilePhotoUrl
            }
            // If it's a relative path, construct the full URL
            return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${profileData.profilePhotoUrl}`
        }
        
        // Fallback to session data
        return session?.user?.profilePhotoUrl || session?.user?.image || ''
    }

    // Get user display name from profile data or session
    const getUserDisplayName = () => {
        if (profileData?.firstName && profileData?.lastName) {
            return `${profileData.firstName} ${profileData.lastName}`
        }
        if (profileData?.firstName) {
            return profileData.firstName
        }
        if (session?.user?.name) {
            return session.user.name
        }
        return 'Anonymous'
    }

    const avatarProps = {
        ...(getProfilePhotoUrl() && getProfilePhotoUrl() !== ''
            ? { src: getProfilePhotoUrl() }
            : { icon: <PiUserDuotone /> }),
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {getUserDisplayName()}
                        </div>
                        <div className="text-xs">
                            {session?.user?.email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" href={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item variant="divider" />
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
