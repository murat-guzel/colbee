'use client'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import { apiSignUp } from '@/services/AuthService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const SignUpClient = () => {
    const router = useRouter()
    const { login } = useAuth()

    const handleSignUp = async ({ values, setSubmitting, setMessage }) => {
        try {
            setSubmitting(true)
            
            console.log('Sign up values:', values)
            
            const response = await apiSignUp(values)
            
            console.log('Sign up response:', response)
            
            // Auto-login after signup
            if (response.token) {
                login(response.user, response.token)
            }

            toast.push(
                <Notification title="Account created!" type="success">
                    Welcome, {response.user.userName}! Your account has been created successfully.
                </Notification>,
            )
            
            // Redirect to home page after successful signup
            router.push('/home')
        } catch (error) {
            console.error('Sign up error:', error)
            console.error('Error response:', error.response)
            const errorMessage = error.response?.data?.message || 'Sign up failed. Please try again.'
            setMessage(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    return <SignUp onSignUp={handleSignUp} />
}

export default SignUpClient
