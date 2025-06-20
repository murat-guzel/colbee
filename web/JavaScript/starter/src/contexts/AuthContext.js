'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { apiGetProfile, apiLogout } from '@/services/AuthService'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken')
            const storedUser = localStorage.getItem('user')

            if (token && storedUser) {
                try {
                    // Verify token with backend
                    const response = await apiGetProfile()
                    setUser(response.user)
                } catch (error) {
                    console.error('Auth check failed:', error)
                    // Clear invalid auth data
                    localStorage.removeItem('authToken')
                    localStorage.removeItem('user')
                    setUser(null)
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        }

        checkAuth()
    }, [])

    const login = (userData, token) => {
        setUser(userData)
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = async () => {
        try {
            await apiLogout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setUser(null)
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            router.push('/sign-in')
        }
    }

    const updateUser = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 