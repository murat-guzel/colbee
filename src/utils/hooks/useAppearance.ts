import { useTheme } from './useTheme'

export const useAppearance = () => {
    const { mode } = useTheme()
    return mode
} 