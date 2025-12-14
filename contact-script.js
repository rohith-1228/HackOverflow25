// Contact Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const newsletterCheckbox = document.getElementById('newsletter');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    
    // Button elements
    const submitBtn = contactForm.querySelector('.btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Modal elements
    const successModal = document.getElementById('successModal');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    // Initialize the page
    initializePage();

    function initializePage() {
        // Add event listeners
        addEventListeners();
        
        // Initialize FAQ functionality
        initializeFAQ();
        
        console.log('Contact page initialized successfully!');
    }

    function addEventListeners() {
        // Form submission
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        nameInput.addEventListener('blur', () => validateName());
        emailInput.addEventListener('blur', () => validateEmail());
        messageInput.addEventListener('blur', () => validateMessage());
        
        // Clear errors on input
        nameInput.addEventListener('input', () => clearError(nameError));
        emailInput.addEventListener('input', () => clearError(emailError));
        messageInput.addEventListener('input', () => clearError(messageError));
        
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // Close modal on outside click
        successModal.addEventListener('click', handleModalClose);
        
        // Close modal on escape key
        document.addEventListener('keydown', handleKeyDown);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            showNotification('Please fix the errors in the form before submitting.', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide loading state
            setLoadingState(false);
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            resetForm();
            
            console.log('Form submitted successfully!');
        }, 2000);
    }

    function validateName() {
        const name = nameInput.value.trim();
        
        if (!name) {
            showError(nameError, 'Name is required');
            return false;
        }
        
        if (name.length < 2) {
            showError(nameError, 'Name must be at least 2 characters long');
            return false;
        }
        
        if (name.length > 50) {
            showError(nameError, 'Name must be less than 50 characters');
            return false;
        }
        
        clearError(nameError);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(emailError, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError(emailError, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailError);
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        
        if (!message) {
            showError(messageError, 'Message is required');
            return false;
        }
        
        if (message.length < 10) {
            showError(messageError, 'Message must be at least 10 characters long');
            return false;
        }
        
        if (message.length > 1000) {
            showError(messageError, 'Message must be less than 1000 characters');
            return false;
        }
        
        clearError(messageError);
        return true;
    }

    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function clearError(errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }

    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.add('show');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.remove('show');
        }
    }

    function resetForm() {
        contactForm.reset();
        clearAllErrors();
    }

    function clearAllErrors() {
        clearError(nameError);
        clearError(emailError);
        clearError(messageError);
    }

    function showSuccessModal() {
        successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function handleModalClose(e) {
        if (e.target === successModal) {
            closeModal('successModal');
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeModal('successModal');
        }
    }

    function toggleMobileMenu() {
        // Add mobile menu functionality if needed
        console.log('Mobile menu toggled');
    }

    function initializeFAQ() {
        // FAQ functionality is handled by the toggleFAQ function
        console.log('FAQ initialized');
    }

    // FAQ Toggle Function (called from HTML)
    window.toggleFAQ = function(button) {
        const faqItem = button.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    };

    // Close Modal Function (called from HTML)
    window.closeModal = closeModal;

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
                    border-left-color: var(--info);
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

    // Form data collection for analytics (optional)
    function collectFormData() {
        return {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectSelect.value,
            message: messageInput.value.trim(),
            newsletter: newsletterCheckbox.checked,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
    }

    // Enhanced form submission with data collection
    function handleEnhancedFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            showNotification('Please fix the errors in the form before submitting.', 'error');
            return;
        }
        
        // Collect form data
        const formData = collectFormData();
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate API call
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            setLoadingState(false);
            
            if (data.success) {
                showSuccessModal();
                resetForm();
                
                // Track successful submission (analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        event_category: 'engagement',
                        event_label: 'contact_page'
                    });
                }
            } else {
                showNotification(data.message || 'There was an error submitting your message. Please try again.', 'error');
            }
        })
        .catch(error => {
            setLoadingState(false);
            console.error('Error:', error);
            showNotification('There was an error submitting your message. Please try again.', 'error');
        });
    }

    // Auto-save form data to localStorage (optional feature)
    function autoSaveFormData() {
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectSelect.value,
            message: messageInput.value,
            newsletter: newsletterCheckbox.checked
        };
        
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }

    function loadSavedFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                nameInput.value = formData.name || '';
                emailInput.value = formData.email || '';
                subjectSelect.value = formData.subject || '';
                messageInput.value = formData.message || '';
                newsletterCheckbox.checked = formData.newsletter || false;
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }

    function clearSavedFormData() {
        localStorage.removeItem('contactFormData');
    }

    // Add auto-save functionality
    [nameInput, emailInput, subjectSelect, messageInput, newsletterCheckbox].forEach(element => {
        if (element) {
            element.addEventListener('input', autoSaveFormData);
            element.addEventListener('change', autoSaveFormData);
        }
    });

    // Load saved data on page load
    loadSavedFormData();

    // Clear saved data on successful submission
    const originalHandleFormSubmit = handleFormSubmit;
    handleFormSubmit = function(e) {
        originalHandleFormSubmit(e);
        if (successModal.classList.contains('hidden') === false) {
            clearSavedFormData();
        }
    };

    // Character counter for message field
    function addCharacterCounter() {
        const messageGroup = messageInput.closest('.form-group');
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--muted);
            margin-top: 0.25rem;
        `;
        
        function updateCounter() {
            const length = messageInput.value.length;
            const maxLength = 1000;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = 'var(--warning)';
            } else if (length > maxLength) {
                counter.style.color = 'var(--error)';
            } else {
                counter.style.color = 'var(--muted)';
            }
        }
        
        messageInput.addEventListener('input', updateCounter);
        messageGroup.appendChild(counter);
        updateCounter();
    }

    // Initialize character counter
    addCharacterCounter();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to contact info items
    const contactInfoItems = document.querySelectorAll('.contact-info-item');
    contactInfoItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInUp 0.6s ease-out forwards';
    });

    // Add fadeInUp animation
    if (!document.querySelector('#fade-in-up-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'fade-in-up-styles';
        styleElement.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
});

