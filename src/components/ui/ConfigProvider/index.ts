import { createContext, useContext } from 'react'

interface ConfigContextType {
    themeColor: string
}

const ConfigContext = createContext<ConfigContextType>({
    themeColor: '#1e88e5'
})

export const useConfig = () => {
    return useContext(ConfigContext)
} 