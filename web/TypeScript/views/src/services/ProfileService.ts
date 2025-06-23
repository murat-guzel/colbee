import ApiService from './ApiService'

export async function apiGetUserProfile<T>(userId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/profile/${userId}`,
        method: 'get',
    })
}

export async function apiUpdateUserProfile<T>(userId: string, data: any) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/profile/${userId}`,
        method: 'put',
        data,
    })
}

export async function apiUploadProfilePhoto<T>(userId: string, file: File) {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    
    return ApiService.fetchDataWithAxios<T>({
        url: `/profile/${userId}/photo`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiDeleteProfilePhoto<T>(userId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/profile/${userId}/photo`,
        method: 'delete',
    })
}

export function getProfilePhotoUrl(userId: string, filename: string) {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/profile/${userId}/photo/${filename}`;
} 