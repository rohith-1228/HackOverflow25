// Civic Issue Reporting System - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = !mobileNav.classList.contains('hidden');
        
        if (isOpen) {
            // Close menu
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            // Open menu
            mobileNav.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mobileNav.contains(event.target);
        const isClickOnButton = mobileMenuBtn.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnButton && !mobileNav.classList.contains('hidden')) {
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed navigation
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const scrollPos = window.scrollY + 100; // Offset for fixed nav

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            updateActiveNavLink();
        }, 10);
    });

    // Initial call to set active link
    updateActiveNavLink();

    // Button click handlers for demo purposes
    const reportButtons = document.querySelectorAll('button:contains("Report an Issue"), button:contains("Report an Issue Now")');
    const viewButtons = document.querySelectorAll('button:contains("View Reported Issues"), button:contains("Track Status")');
    const adminButtons = document.querySelectorAll('button:contains("Admin Login")');

    // Helper function to find buttons by text content
    function findButtonsByText(text) {
        const buttons = document.querySelectorAll('button');
        return Array.from(buttons).filter(button => 
            button.textContent.includes(text)
        );
    }

    // Report Issue buttons
    findButtonsByText('Report an Issue').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Report Issue feature would open here!', 'info');
        });
    });

    findButtonsByText('Report an Issue Now').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Report Issue feature would open here!', 'info');
        });
    });

    // View Issues buttons
    findButtonsByText('View Reported Issues').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('View Issues feature would open here!', 'info');
        });
    });

    findButtonsByText('Track Status').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Track Status feature would open here!', 'info');
        });
    });

    // Admin Login buttons
    findButtonsByText('Admin Login').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Admin Login feature would open here!', 'info');
        });
    });

    // Learn More button
    findButtonsByText('Learn More').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Learn More feature would open here!', 'info');
        });
    });

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

        // Add notification styles
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 1000;
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
                border-left-color: var(--destructive);
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

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'notification-styles';
            styleElement.textContent = notificationStyles;
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
    const slideOutStyles = `
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

    if (!document.querySelector('#slide-out-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'slide-out-styles';
        styleElement.textContent = slideOutStyles;
        document.head.appendChild(styleElement);
    }

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.value-card, .step-card, .feature-card, .stat-card-large, .impact-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize animation styles
    const animationElements = document.querySelectorAll('.value-card, .step-card, .feature-card, .stat-card-large, .impact-card');
    animationElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Throttled scroll event for animations
    let animationTimeout;
    window.addEventListener('scroll', function() {
        if (animationTimeout) {
            clearTimeout(animationTimeout);
        }
        
        animationTimeout = setTimeout(function() {
            animateOnScroll();
        }, 10);
    });

    // Initial animation call
    animateOnScroll();

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .stat-number-large, .resolution-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    
                    // Handle percentage counter
                    if (counter.textContent.includes('%')) {
                        counter.textContent = Math.floor(current) + '%';
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    
                    requestAnimationFrame(updateCounter);
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Initialize counter animations
    animateCounters();

    // Add hover effects for cards
    const cards = document.querySelectorAll('.value-card, .step-card, .feature-card, .stat-card-large, .impact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect styles
    const rippleStyles = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector('#ripple-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'ripple-styles';
        styleElement.textContent = rippleStyles;
        document.head.appendChild(styleElement);
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });

    // Form validation (for future use)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }

    // Add error styles for form validation
    const formErrorStyles = `
        .error {
            border-color: var(--destructive) !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
    `;

    if (!document.querySelector('#form-error-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'form-error-styles';
        styleElement.textContent = formErrorStyles;
        document.head.appendChild(styleElement);
    }

    // Performance optimization: Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(function() {
            // Recalculate any size-dependent calculations
            updateActiveNavLink();
        }, 250);
    });

    // Initialize all animations and effects
    console.log('Civic Issue Reporting System initialized successfully!');
});
