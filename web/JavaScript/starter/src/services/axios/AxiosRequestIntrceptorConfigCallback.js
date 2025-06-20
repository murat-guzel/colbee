const AxiosRequestIntrceptorConfigCallback = (config) => {
    /** handle config mutatation here before request to server */
    
    // Add JWT token to request headers if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config
}

export default AxiosRequestIntrceptorConfigCallback
