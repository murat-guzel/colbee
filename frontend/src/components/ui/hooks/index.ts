import { useState, useCallback } from 'react'
import useUniqueId from './useUniqueId'

export const useDisclosure = (defaultIsOpen = false) => {
    const [isOpen, setIsOpen] = useState(defaultIsOpen)

    const onOpen = useCallback(() => setIsOpen(true), [])
    const onClose = useCallback(() => setIsOpen(false), [])
    const onToggle = useCallback(() => setIsOpen(prev => !prev), [])

    return { isOpen, onOpen, onClose, onToggle }
}

export default {
    useUniqueId,
    useDisclosure
} 