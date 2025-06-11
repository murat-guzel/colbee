import { useRef } from 'react'

let uniqueId = 0

export default function useUniqueId() {
    const idRef = useRef<string>()

    if (!idRef.current) {
        uniqueId++
        idRef.current = uniqueId.toString()
    }

    return idRef.current
} 