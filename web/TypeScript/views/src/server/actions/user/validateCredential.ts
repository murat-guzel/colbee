'use server'
import type { SignInCredential } from '@/@types/auth'
import { apiSignIn } from '@/services/AuthService'

const validateCredential = async (values: SignInCredential) => {
    try {
        const { email, password } = values

        // Use our own backend API
        const response = await apiSignIn({ email, password })
        
        console.log('Backend response:', response)
        console.log('Backend user:', response?.user)
        
        if (response && response.user) {
            const user = {
                id: response.user.id,
                name: response.user.userName,
                email: response.user.email,
                profilePhotoUrl: response.user.profilePhotoUrl || '',
                authority: [response.user.role || 'user'],
                jwtToken: response.token,
            }
            console.log('Returning user:', user)
            return user
        }

        return null
    } catch (error) {
        console.error('Credential validation error:', error)
        return null
    }
}

export default validateCredential
