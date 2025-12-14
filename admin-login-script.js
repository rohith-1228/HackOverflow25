// Admin Login Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('adminLoginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const passwordToggle = document.getElementById('passwordToggle');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    
    // Modal elements
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Error elements
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const resetEmailError = document.getElementById('resetEmailError');

    // Initialize the page
    initializePage();

    function initializePage() {
        // Add event listeners
        addEventListeners();
        
        // Initialize form validation
        initializeFormValidation();
        
        // Check for saved credentials
        checkSavedCredentials();
        
        // Set initial button state
        updateLoginButtonState();
        
        console.log('Admin Login page initialized successfully!');
    }

    function addEventListeners() {
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
        
        // Input validation
        usernameInput.addEventListener('input', handleInputChange);
        passwordInput.addEventListener('input', handleInputChange);
        
        // Password toggle
        passwordToggle.addEventListener('click', togglePasswordVisibility);
        
        // Forgot password
        forgotPasswordLink.addEventListener('click', showForgotPasswordModal);
        forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
        
        // Modal close events
        document.addEventListener('click', handleModalClose);
        document.addEventListener('keydown', handleKeyDown);
        
        // Auto-save credentials
        rememberMeCheckbox.addEventListener('change', handleRememberMeChange);
    }

    function initializeFormValidation() {
        // Add visual feedback for validation
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
                clearFieldError(input.id);
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                validateField(input.id);
            });
        });
    }

    function handleInputChange() {
        updateLoginButtonState();
        clearFieldError(event.target.id);
    }

    function updateLoginButtonState() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        loginBtn.disabled = !username || !password;
    }

    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        
        clearFieldError(fieldName);
        
        if (!value) {
            showFieldError(fieldName, `${fieldName === 'username' ? 'Username/Email' : 'Password'} is required`);
            return false;
        }
        
        if (fieldName === 'username') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
            
            if (!emailRegex.test(value) && !usernameRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address or username');
                return false;
            }
        }
        
        if (fieldName === 'password' && value.length < 6) {
            showFieldError(fieldName, 'Password must be at least 6 characters long');
            return false;
        }
        
        return true;
    }

    function showFieldError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const field = document.getElementById(fieldName);
        
        if (errorElement && field) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearFieldError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const field = document.getElementById(fieldName);
        
        if (errorElement && field) {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    function togglePasswordVisibility() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const eyeIcon = passwordToggle.querySelector('.eye-icon');
        const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');
        
        if (isPassword) {
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
        } else {
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
        }
    }

    function handleRememberMeChange() {
        if (!rememberMeCheckbox.checked) {
            // Clear saved credentials if unchecked
            localStorage.removeItem('admin_username');
            localStorage.removeItem('admin_remember');
        }
    }

    function checkSavedCredentials() {
        const savedUsername = localStorage.getItem('admin_username');
        const isRemembered = localStorage.getItem('admin_remember') === 'true';
        
        if (isRemembered && savedUsername) {
            usernameInput.value = savedUsername;
            rememberMeCheckbox.checked = true;
            passwordInput.focus();
        } else {
            usernameInput.focus();
        }
        
        updateLoginButtonState();
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isUsernameValid = validateField('username');
        const isPasswordValid = validateField('password');
        
        if (!isUsernameValid || !isPasswordValid) {
            return;
        }
        
        // Show loading state
        setLoginLoading(true);
        
        try {
            // Simulate API call (replace with actual authentication endpoint)
            const response = await authenticateUser(usernameInput.value.trim(), passwordInput.value);
            
            if (response.success) {
                // Save credentials if remember me is checked
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('admin_username', usernameInput.value.trim());
                    localStorage.setItem('admin_remember', 'true');
                }
                
                // Show success modal
                showSuccessModal();
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 2000);
            } else {
                throw new Error(response.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            showErrorModal(error.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setLoginLoading(false);
        }
    }

    async function authenticateUser(username, password) {
        // Demo credentials for admin login
        const validCredentials = [
            { username: 'admin@municipal.gov', password: 'admin123' },
            { username: 'admin', password: 'admin123' },
            { username: 'authority@city.gov', password: 'authority123' },
            { username: 'officer@municipal.gov', password: 'officer123' }
        ];
        
        try {
            // Try to login with backend API first
            const result = await login(username, password);
            
            if (result.token) {
                // Store admin session
                localStorage.setItem('admin_token', result.token);
                localStorage.setItem('admin_user', JSON.stringify(result.user));
                
                return {
                    success: true,
                    message: 'Authentication successful',
                    user: {
                        username: result.user?.username || username,
                        email: result.user?.email || username,
                        role: 'administrator',
                        permissions: ['view_issues', 'manage_issues', 'update_status', 'view_reports']
                    }
                };
            } else {
                throw new Error(result.message || 'Backend authentication failed');
            }
        } catch (error) {
            console.log('Backend login failed, trying demo credentials:', error.message);
            
            // Fallback to demo credentials
            const isValid = validCredentials.some(cred => 
                cred.username === username && cred.password === password
            );
            
            if (isValid) {
                // Store demo admin session
                const demoToken = 'demo_admin_' + Date.now();
                localStorage.setItem('admin_token', demoToken);
                localStorage.setItem('admin_user', JSON.stringify({
                    username: username,
                    role: 'administrator'
                }));
                
                return {
                    success: true,
                    message: 'Authentication successful (demo mode)',
                    user: {
                        username: username,
                        role: 'administrator',
                        permissions: ['view_issues', 'manage_issues', 'update_status', 'view_reports']
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid username or password. Try: admin/admin123'
                };
            }
        }
    }

    function setLoginLoading(loading) {
        loginBtn.disabled = loading;
        form.classList.toggle('loading', loading);
        
        const btnText = loginBtn.querySelector('.btn-text');
        const btnSpinner = loginBtn.querySelector('.btn-spinner');
        
        if (loading) {
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    }

    function showSuccessModal() {
        successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function showErrorModal(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        errorModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeErrorModal() {
        errorModal.classList.add('hidden');
        document.body.style.overflow = '';
        passwordInput.focus();
    }

    function showForgotPasswordModal(e) {
        e.preventDefault();
        forgotPasswordModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus on email input
        setTimeout(() => {
            document.getElementById('resetEmail').focus();
        }, 100);
    }

    function closeForgotPasswordModal() {
        forgotPasswordModal.classList.add('hidden');
        document.body.style.overflow = '';
        forgotPasswordForm.reset();
        clearFieldError('resetEmail');
    }

    async function handleForgotPasswordSubmit(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('resetEmail');
        const email = emailInput.value.trim();
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showFieldError('resetEmail', 'Email address is required');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showFieldError('resetEmail', 'Please enter a valid email address');
            return;
        }
        
        // Clear any previous errors
        clearFieldError('resetEmail');
        
        // Simulate API call
        try {
            // Show loading state
            const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Password reset instructions have been sent to your email address.', 'success');
            
            // Close modal
            closeForgotPasswordModal();
            
        } catch (error) {
            showNotification('Failed to send reset instructions. Please try again.', 'error');
        } finally {
            const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    function handleModalClose(e) {
        if (e.target === successModal || e.target === errorModal || e.target === forgotPasswordModal) {
            if (!successModal.classList.contains('hidden')) {
                // Don't close success modal automatically
                return;
            }
            if (!errorModal.classList.contains('hidden')) {
                closeErrorModal();
            }
            if (!forgotPasswordModal.classList.contains('hidden')) {
                closeForgotPasswordModal();
            }
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            if (!errorModal.classList.contains('hidden')) {
                closeErrorModal();
            } else if (!forgotPasswordModal.classList.contains('hidden')) {
                closeForgotPasswordModal();
            }
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'notification-styles';
            styleElement.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1001;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    border-left: 4px solid var(--primary);
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                }
                
                .notification-info {
                    border-left-color: var(--primary);
                }
                
                .notification-success {
                    border-left-color: var(--success);
                }
                
                .notification-warning {
                    border-left-color: var(--warning);
                }
                
                .notification-error {
                    border-left-color: var(--error);
                }
                
                .notification-content {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .notification-message {
                    color: var(--foreground);
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--muted-foreground);
                    cursor: pointer;
                    padding: 0;
                    margin-left: 1rem;
                    line-height: 1;
                }
                
                .notification-close:hover {
                    color: var(--foreground);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add slide out animation
    if (!document.querySelector('#slide-out-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'slide-out-styles';
        styleElement.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Security features
    function addSecurityFeatures() {
        // Prevent right-click context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Prevent F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', e => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                showNotification('This action is not allowed for security reasons.', 'warning');
            }
        });
        
        // Clear sensitive data on page unload
        window.addEventListener('beforeunload', () => {
            if (!rememberMeCheckbox.checked) {
                passwordInput.value = '';
            }
        });
    }

    // Initialize security features
    addSecurityFeatures();

    // Make functions globally available
    window.closeErrorModal = closeErrorModal;
    window.closeForgotPasswordModal = closeForgotPasswordModal;
});

// Additional utility functions
function generateSecureToken() {
    return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '');
}

function hashPassword(password) {
    // Simple hash function for demo (use proper hashing in production)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateSecureToken,
        hashPassword
    };
}
