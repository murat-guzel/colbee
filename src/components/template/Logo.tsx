import React from 'react'
import { useAppearance } from '@/utils/hooks/useAppearance'
import classNames from 'classnames'
import { useConfig } from '../ui/ConfigProvider'

const Logo = () => {
    const { themeColor } = useConfig()
    const mode = useAppearance()

    return (
        <div className="flex items-center gap-2">
            <div className="font-bold text-2xl">
                COLBEE
                <span 
                    className={classNames(
                        'inline-block w-2 h-2 rounded-full ml-1',
                        mode === 'dark' ? 'bg-white' : 'bg-black'
                    )}
                />
            </div>
        </div>
    )
}

export default Logo 