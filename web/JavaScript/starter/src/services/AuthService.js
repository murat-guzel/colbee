import ApiService from './ApiService'

export async function apiSignUp(data) {
    return ApiService.fetchDataWithAxios({
        url: '/auth/sign-up',
        method: 'post',
        data,
    })
}

export async function apiSignIn(data) {
    return ApiService.fetchDataWithAxios({
        url: '/auth/sign-in',
        method: 'post',
        data,
    })
}

export async function apiLogout() {
    return ApiService.fetchDataWithAxios({
        url: '/auth/logout',
        method: 'post',
    })
}

export async function apiGetProfile() {
    return ApiService.fetchDataWithAxios({
        url: '/auth/profile',
        method: 'get',
    })
}

export async function apiUpdateProfile(data) {
    return ApiService.fetchDataWithAxios({
        url: '/auth/profile',
        method: 'put',
        data,
    })
}

export async function apiChangePassword(data) {
    return ApiService.fetchDataWithAxios({
        url: '/auth/change-password',
        method: 'put',
        data,
    })
}

export async function apiForgotPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: '/auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: '/auth/reset-password',
        method: 'post',
        data,
    })
}
