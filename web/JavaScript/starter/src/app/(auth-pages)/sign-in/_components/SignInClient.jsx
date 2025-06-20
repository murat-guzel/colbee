'use client'
import { useState } from 'react'
import SignIn from '@/components/auth/SignIn'
import { apiSignIn } from '@/services/AuthService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const SignInClient = () => {
    const router = useRouter()
    const { login } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSignIn = async ({ values, setSubmitting, setMessage }) => {
        try {
            setIsSubmitting(true)
            setSubmitting(true)

            console.log('Sign in values:', values)

            const response = await apiSignIn(values)
            
            console.log('Sign in response:', response)
            
            // Use AuthContext to login
            login(response.user, response.token)

            console.log('User logged in, redirecting to /home...')

            toast.push(
                <Notification title="Sign in successful!" type="success">
                    Welcome back, {response.user.userName}!
                </Notification>,
            )

            // Redirect to home page
            console.log('Redirecting to /home...')
            window.location.href = '/home'
            
            console.log('Redirect called')
            
        } catch (error) {
            console.error('Sign in error:', error)
            console.error('Error response:', error.response)
            const errorMessage = error.response?.data?.message || 'Sign in failed. Please try again.'
            setMessage(errorMessage)
        } finally {
            setIsSubmitting(false)
            setSubmitting(false)
        }
    }

    const handleOAuthSignIn = async ({ type }) => {
        // OAuth functionality can be implemented later
        console.log('OAuth sign in:', type)
    }

    return <SignIn onSignIn={handleSignIn} onOauthSignIn={handleOAuthSignIn} />
}

export default SignInClient
