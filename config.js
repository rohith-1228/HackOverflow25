// Configuration for SIH Project
window.SERVER_CONFIG = {
    // Backend API base URL
    API_BASE: 'http://localhost:8080/api',
    
    // Alternative URLs for different environments
    DEVELOPMENT: 'http://localhost:8080/api',
    PRODUCTION: 'https://your-production-domain.com/api',
    
    // Other configuration options
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    
    // Feature flags
    FEATURES: {
        AUTO_REFRESH: true,
        REAL_TIME_UPDATES: false,
        FILE_UPLOAD: true,
        GEOLOCATION: true
    }
};

// Auto-detect environment and set appropriate API base
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.SERVER_CONFIG.API_BASE = window.SERVER_CONFIG.DEVELOPMENT;
} else {
    window.SERVER_CONFIG.API_BASE = window.SERVER_CONFIG.PRODUCTION;
}

console.log('Server config loaded:', window.SERVER_CONFIG);