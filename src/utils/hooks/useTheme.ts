import { useContext } from 'react'
import { ThemeContext } from '@/components/template/Theme/ThemeContext'

export const useTheme = () => {
    const theme = useContext(ThemeContext)
    return theme
} 