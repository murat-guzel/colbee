import type { InternalAxiosRequestConfig } from 'axios'

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig,
) => {
    /** handle config mutatation here before request to server */
    
    // Add JWT token to request headers if available
    if (typeof window !== 'undefined') {
        // Try to get token from localStorage (set by our custom auth system)
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config
}

export default AxiosRequestIntrceptorConfigCallback
