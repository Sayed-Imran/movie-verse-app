import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    baseURL: `${window.location.origin}/api`,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Check if username exists in localStorage
        const username = localStorage.getItem('username');

        // If username exists, add it to every request
        if (username) {
            // Add username to request headers - in a type-safe way
            if (config.headers) {
                // Modern axios uses AxiosHeaders which has a set method
                if (typeof config.headers.set === 'function') {
                    config.headers.set('X-Username', username);
                } else {
                    // Fallback for older axios versions
                    config.headers['X-Username'] = username;
                }
            }

            // No longer adding as query parameter
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
