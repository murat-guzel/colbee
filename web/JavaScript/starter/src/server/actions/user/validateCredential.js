'use server'
import { apiSignIn } from '@/services/AuthService'

const validateCredential = async (values) => {
    try {
        const { email, password } = values

        // Use our own backend API
        const response = await apiSignIn({ email, password })
        
        if (response && response.user) {
            return {
                id: response.user.id,
                name: response.user.userName,
                email: response.user.email,
                avatar: response.user.avatar || '',
                authority: [response.user.role || 'user'],
            }
        }

        return null
    } catch (error) {
        console.error('Credential validation error:', error)
        return null
    }
}

export default validateCredential
