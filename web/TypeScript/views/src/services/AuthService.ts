import ApiService from './ApiService'

import type {
    SignUpCredential,
    SignInCredential,
    ForgotPassword,
    ResetPassword,
    SignUpResponse,
    SignInResponse,
} from '@/@types/auth'

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: '/auth/sign-up',
        method: 'post',
        data,
    })
}

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: '/auth/sign-in',
        method: 'post',
        data,
    })
}

export async function apiChangePassword(data: { currentPassword: string; newPassword: string }) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: '/auth/change-password',
        method: 'put',
        data,
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/reset-password',
        method: 'post',
        data,
    })
}
