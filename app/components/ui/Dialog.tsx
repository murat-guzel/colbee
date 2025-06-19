'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    onRequestClose?: () => void
    children: React.ReactNode
    width?: number
    height?: number
    className?: string
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    onRequestClose,
    children,
    width = 500,
    height,
    className = '',
}) => {
    const handleBackdropClick = () => {
        if (onRequestClose) {
            onRequestClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={handleBackdropClick}
                    />
                    
                    {/* Dialog */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 ${className}`}
                        style={{
                            width: width ? `${width}px` : 'auto',
                            height: height ? `${height}px` : 'auto',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                        }}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Dialog 