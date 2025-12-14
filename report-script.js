// Report Issue Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('reportForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const successModal = document.getElementById('successModal');
    
    // Form fields
    const issueTitle = document.getElementById('issueTitle');
    const issueDescription = document.getElementById('issueDescription');
    const issueLocation = document.getElementById('issueLocation');
    const issuePhoto = document.getElementById('issuePhoto');
    const reporterName = document.getElementById('reporterName');
    const reporterEmail = document.getElementById('reporterEmail');
    const reporterPhone = document.getElementById('reporterPhone');
    
    // Location button
    const getLocationBtn = document.getElementById('getLocationBtn');
    
    // File preview
    const filePreview = document.getElementById('filePreview');
    
    // Error elements
    const errorElements = {
        issueTitle: document.getElementById('issueTitleError'),
        issueDescription: document.getElementById('issueDescriptionError'),
        issueLocation: document.getElementById('issueLocationError'),
        issuePhoto: document.getElementById('issuePhotoError'),
        reporterName: document.getElementById('reporterNameError'),
        reporterEmail: document.getElementById('reporterEmailError'),
        reporterPhone: document.getElementById('reporterPhoneError')
    };

    // Form validation rules
    const validationRules = {
        issueTitle: {
            required: true,
            maxLength: 50,
            message: 'Title is required and must be less than 50 characters'
        },
        issueDescription: {
            required: true,
            minLength: 10,
            message: 'Description is required and must be at least 10 characters'
        },
        issueLocation: {
            required: true,
            message: 'Location is required'
        },
        reporterName: {
            required: true,
            message: 'Name is required'
        },
        reporterEmail: {
            required: false,
            type: 'email',
            message: 'Please enter a valid email address'
        },
        reporterPhone: {
            required: false,
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit phone number'
        }
    };

    // Initialize the page
    initializePage();

    function initializePage() {
        // Add event listeners
        addEventListeners();
        
        // Initialize file upload preview
        initializeFileUpload();
        
        // Initialize location services
        initializeLocationServices();
        
        // Initialize form validation
        initializeFormValidation();
        
        console.log('Report Issue page initialized successfully!');
    }

    function addEventListeners() {
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => validateField(fieldName));
                field.addEventListener('input', () => clearFieldError(fieldName));
            }
        });
        
        // Photo upload
        issuePhoto.addEventListener('change', handlePhotoUpload);
        
        // Location button
        getLocationBtn.addEventListener('click', getCurrentLocation);
        
        // Modal close
        document.addEventListener('click', handleModalClose);
        
        // Escape key to close modal
        document.addEventListener('keydown', handleKeyDown);
    }

    function initializeFileUpload() {
        // Drag and drop functionality
        const fileUploadLabel = document.querySelector('.file-upload-label');
        
        fileUploadLabel.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary)';
            this.style.backgroundColor = 'rgba(5, 150, 105, 0.05)';
        });
        
        fileUploadLabel.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border)';
            this.style.backgroundColor = 'var(--input-bg)';
        });
        
        fileUploadLabel.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border)';
            this.style.backgroundColor = 'var(--input-bg)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });
    }

    function initializeLocationServices() {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            getLocationBtn.style.display = 'none';
        }
    }

    function initializeFormValidation() {
        // Add visual feedback for validation
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('focus', () => {
                    field.parentElement.classList.add('focused');
                });
                
                field.addEventListener('blur', () => {
                    field.parentElement.classList.remove('focused');
                });
            }
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = validateAllFields();
        
        if (isValid) {
            // Check contact requirements
            const hasContact = reporterEmail.value.trim() || reporterPhone.value.trim();
            if (!hasContact) {
                showFieldError('reporterEmail', 'At least one contact method (email or phone) is required');
                showFieldError('reporterPhone', 'At least one contact method (email or phone) is required');
                return;
            }
            
            // Submit the form
            submitForm();
        }
    }

    function validateAllFields() {
        let isValid = true;
        
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        const rules = validationRules[fieldName];
        
        // Clear previous error
        clearFieldError(fieldName);
        
        // Required validation
        if (rules.required && !value) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            return true;
        }
        
        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            showFieldError(fieldName, rules.message);
            return false;
        }
        
        // Type validations
        if (rules.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, rules.message);
                return false;
            }
        }
        
        // Pattern validation
        if (rules.pattern && value) {
            if (!rules.pattern.test(value)) {
                showFieldError(fieldName, rules.message);
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = errorElements[fieldName];
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = errorElements[fieldName];
        
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    }

    function handleFileSelection(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            showFieldError('issuePhoto', 'Please upload a JPG or PNG image');
            return;
        }
        
        // Validate file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showFieldError('issuePhoto', 'File size must be less than 2MB');
            return;
        }
        
        // Clear any previous errors
        clearFieldError('issuePhoto');
        
        // Show preview
        showFilePreview(file);
    }

    function showFilePreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            filePreview.innerHTML = `
                <div class="preview-container">
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <div class="preview-info">
                        <strong>${file.name}</strong><br>
                        Size: ${(file.size / 1024).toFixed(1)} KB
                    </div>
                    <button type="button" class="remove-file-btn" onclick="removeFile()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Remove
                    </button>
                </div>
            `;
            filePreview.classList.add('show');
        };
        
        reader.readAsDataURL(file);
    }

    function removeFile() {
        issuePhoto.value = '';
        filePreview.classList.remove('show');
        filePreview.innerHTML = '';
    }

    function getCurrentLocation() {
        if (!navigator.geolocation) {
            showNotification('Geolocation is not supported by this browser', 'error');
            return;
        }
        
        getLocationBtn.disabled = true;
        getLocationBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
        `;
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Use reverse geocoding to get address
                reverseGeocode(latitude, longitude);
                
                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                `;
            },
            function(error) {
                let errorMessage = 'Unable to get your location';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                
                showNotification(errorMessage, 'error');
                
                getLocationBtn.disabled = false;
                getLocationBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                `;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }

    function reverseGeocode(lat, lng) {
        // Using a free geocoding service (you might want to use Google Maps API for production)
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.city && data.locality) {
                    const address = `${data.locality}, ${data.city}, ${data.countryName}`;
                    issueLocation.value = address;
                    clearFieldError('issueLocation');
                } else {
                    issueLocation.value = `${lat}, ${lng}`;
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                issueLocation.value = `${lat}, ${lng}`;
            });
    }

    async function submitForm() {
        // Show loading state
        setSubmitLoading(true);
        
        try {
            // Check if user is logged in
            if (!getToken()) {
                // Auto-register user with form data
                const signupResult = await signup(
                    reporterName.value.trim(),
                    reporterEmail.value.trim() || `user${Date.now()}@temp.com`,
                    'defaultpass123'
                );
                
                if (!signupResult.token) {
                    throw new Error('Failed to create user account');
                }
            }
            
            // Create post with issue details
            const title = issueTitle.value.trim();
            const content = `${issueDescription.value.trim()}\n\nLocation: ${issueLocation.value.trim()}\nReporter: ${reporterName.value.trim()}\nContact: ${reporterEmail.value.trim() || reporterPhone.value.trim()}`;
            
            const response = await createPost(title, content);
            
            if (response._id) {
                // Show success modal
                showSuccessModal();
                
                // Reset form after a delay
                setTimeout(() => {
                    resetForm();
                }, 3000);
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showNotification('Failed to submit report. Please try again.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    }

    function simulateApiCall(formData) {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success (in real implementation, this would be an actual API call)
                resolve({
                    success: true,
                    message: 'Report submitted successfully',
                    reportId: 'CIVIC-' + Date.now()
                });
            }, 2000);
        });
    }

    function setSubmitLoading(loading) {
        submitBtn.disabled = loading;
        form.classList.toggle('loading', loading);
        
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

    function hideSuccessModal() {
        successModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function resetForm() {
        form.reset();
        
        // Clear all errors
        Object.keys(errorElements).forEach(fieldName => {
            clearFieldError(fieldName);
        });
        
        // Clear file preview
        filePreview.classList.remove('show');
        filePreview.innerHTML = '';
        
        // Remove visual states
        form.classList.remove('loading', 'success', 'error');
        
        // Focus on first field
        issueTitle.focus();
    }

    function handleModalClose(e) {
        if (e.target === successModal) {
            hideSuccessModal();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
            hideSuccessModal();
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
                    top: 100px;
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

    // Make functions globally available
    window.resetForm = resetForm;
    window.removeFile = removeFile;
});

// Additional utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatFileSize,
        validationRules: {
            issueTitle: { required: true, maxLength: 50 },
            issueDescription: { required: true, minLength: 10 },
            issueLocation: { required: true },
            reporterName: { required: true },
            reporterEmail: { required: false, type: 'email' },
            reporterPhone: { required: false, pattern: /^[0-9]{10}$/ }
        }
    };
}
