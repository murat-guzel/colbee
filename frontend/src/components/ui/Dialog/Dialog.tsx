import React from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    className?: string
}

const Dialog = ({ isOpen, onClose, children, title, className = '' }: DialogProps) => {
    return (
        <HeadlessDialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <HeadlessDialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${className}`}>
                    {title && (
                        <HeadlessDialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            {title}
                        </HeadlessDialog.Title>
                    )}
                    {children}
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    )
}

export default Dialog 