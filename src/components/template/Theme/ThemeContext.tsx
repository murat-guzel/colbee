import { createContext } from 'react'

export type Mode = 'light' | 'dark'

interface ThemeContextType {
    mode: Mode
    setMode: (mode: Mode) => void
}

export const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    setMode: () => {}
}) 