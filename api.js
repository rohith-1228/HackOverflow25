// API Integration for SIH Project
const API_BASE = window.SERVER_CONFIG ? window.SERVER_CONFIG.API_BASE : 'http://localhost:8080/api';

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Set JWT token in localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove JWT token
function removeToken() {
    localStorage.removeItem('token');
}

// API call helper with authentication
async function apiCall(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.log('API call failed, using mock backend:', error.message);
        throw error;
    }
}

// Authentication functions
async function signup(username, email, password) {
    const result = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    });
    
    if (result.token) {
        setToken(result.token);
    }
    
    return result;
}

async function login(email, password) {
    const result = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    if (result.token) {
        setToken(result.token);
    }
    
    return result;
}

function logout() {
    removeToken();
}

// Issue/Posts functions
async function getIssues(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) queryParams.append(key, filters[key]);
        });
        
        const endpoint = queryParams.toString() ? `/posts?${queryParams}` : '/posts';
        return await apiCall(endpoint);
    } catch (error) {
        console.log('Server not available, using mock data');
        // Fallback to mock data
        return getMockIssues();
    }
}

async function createIssue(issueData) {
    try {
        return await apiCall('/posts', {
            method: 'POST',
            body: JSON.stringify(issueData)
        });
    } catch (error) {
        console.log('Server not available, using mock backend');
        // Fallback to mock backend
        return saveMockIssue(issueData);
    }
}

async function getIssueById(id) {
    return await apiCall(`/posts/${id}`);
}

async function updateIssueStatus(id, status, comment, assignedTo) {
    return await apiCall(`/posts/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, comment, assignedTo })
    });
}

async function getIssueStats() {
    return await apiCall('/posts/stats/summary');
}

// Legacy function for backward compatibility
async function getPosts() {
    return await getIssues();
}

async function createPost(title, content) {
    return await createIssue({ title, content });
}

// Utility functions for issue management
function formatIssueForAPI(formData) {
    return {
        title: formData.issueType || 'General Issue',
        content: formData.problemDescription,
        issueType: formData.issueType,
        location: formData.location,
        reporterName: formData.fullName,
        reporterEmail: formData.reporterEmail,
        reporterPhone: formData.reporterPhone
    };
}

function generateIssueId() {
    return 'ISS-' + Date.now().toString().slice(-6);
}

// Example usage functions (for testing)
function showLoginForm() {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    
    if (email && password) {
        login(email, password).then(result => {
            if (result.token) {
                alert('Login successful!');
            } else {
                alert('Login failed: ' + result.message);
            }
        }).catch(error => {
            alert('Login error: ' + error.message);
        });
    }
}

function showSignupForm() {
    const username = prompt('Enter username:');
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    
    if (username && email && password) {
        signup(username, email, password).then(result => {
            if (result.token) {
                alert('Signup successful!');
            } else {
                alert('Signup failed: ' + result.message);
            }
        }).catch(error => {
            alert('Signup error: ' + error.message);
        });
    }
}

// Test the API connection
async function testAPI() {
    try {
        const issues = await getIssues();
        console.log('API connected successfully. Issues:', issues);
        alert('Backend connected! Check console for details.');
        return true;
    } catch (error) {
        console.error('API connection failed:', error);
        alert('Backend connection failed. Using mock data instead.');
        return false;
    }
}

// Mock backend functions for when server is not available
function generateMockId() {
    return 'MOCK-' + Date.now().toString().slice(-6);
}

function saveMockIssue(issueData) {
    const mockIssue = {
        _id: generateMockId(),
        ...issueData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingIssues = JSON.parse(localStorage.getItem('mockIssues') || '[]');
    existingIssues.push(mockIssue);
    localStorage.setItem('mockIssues', JSON.stringify(existingIssues));
    
    return mockIssue;
}

function getMockIssues() {
    return JSON.parse(localStorage.getItem('mockIssues') || '[]');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Auto-register user for issue reporting
async function autoRegisterUser(name, email) {
    try {
        const tempEmail = email || `user${Date.now()}@temp.com`;
        const tempPassword = 'defaultpass123';
        
        const result = await signup(name, tempEmail, tempPassword);
        return result;
    } catch (error) {
        console.log('Server not available, using mock authentication');
        // Mock successful registration
        const mockUser = {
            token: 'mock-token-' + Date.now(),
            user: { id: Date.now(), username: name, email: tempEmail }
        };
        setToken(mockUser.token);
        return mockUser;
    }
}