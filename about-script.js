// About Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    // Initialize the page
    initializePage();

    function initializePage() {
        // Add event listeners
        addEventListeners();
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize counters
        initializeCounters();
        
        console.log('About page initialized successfully!');
    }

    function addEventListeners() {
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
        
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
        
        // Intersection Observer for animations
        setupIntersectionObserver();
    }

    function toggleMobileMenu() {
        // Add mobile menu functionality if needed
        console.log('Mobile menu toggled');
    }

    function initializeAnimations() {
        // Add staggered animation delays to cards
        const missionCards = document.querySelectorAll('.mission-card');
        missionCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        const impactCards = document.querySelectorAll('.impact-card');
        impactCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function initializeCounters() {
        // Animate numbers when they come into view
        const counters = document.querySelectorAll('.stat-number, .impact-number');
        
        const animateCounter = (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format numbers with commas and suffixes
                if (target >= 1000000) {
                    element.textContent = (current / 1000000).toFixed(1) + 'M';
                } else if (target >= 1000) {
                    element.textContent = Math.floor(current / 1000) + 'K';
                } else if (target < 100) {
                    element.textContent = current.toFixed(1) + '%';
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent;
                    
                    // Extract numeric value
                    let target = 0;
                    if (text.includes('K')) {
                        target = parseFloat(text.replace('K', '')) * 1000;
                    } else if (text.includes('M')) {
                        target = parseFloat(text.replace('M', '')) * 1000000;
                    } else if (text.includes('%')) {
                        target = parseFloat(text.replace('%', ''));
                    } else {
                        target = parseInt(text.replace(/,/g, ''));
                    }
                    
                    if (target > 0) {
                        element.textContent = '0';
                        animateCounter(element, target);
                        counterObserver.unobserve(element);
                    }
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function setupIntersectionObserver() {
        // Create intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.mission-card, .impact-card, .value-card'
        );
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Add parallax effect to hero section (subtle)
    function initializeParallax() {
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                const yPos = -(scrolled * parallaxSpeed);
                
                heroSection.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // Initialize parallax effect
    initializeParallax();

    // Add typing effect to hero title (optional)
    function initializeTypingEffect() {
        const heroTitle = document.querySelector('.hero-content h1');
        
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing effect after a short delay
            setTimeout(typeWriter, 500);
        }
    }

    // Uncomment to enable typing effect
    // initializeTypingEffect();

    // Add interactive hover effects to impact cards
    function initializeImpactCardInteractions() {
        const impactCards = document.querySelectorAll('.impact-card');
        
        impactCards.forEach(card => {
            const icon = card.querySelector('.impact-icon');
            const number = card.querySelector('.impact-number');
            
            card.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                number.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
                number.style.transform = 'scale(1)';
            });
        });
    }

    // Initialize impact card interactions
    initializeImpactCardInteractions();

    // Add scroll progress indicator
    function initializeScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), #10b981);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Initialize scroll progress
    initializeScrollProgress();

    // Add floating animation to hero stats
    function initializeFloatingAnimation() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach((item, index) => {
            const animationDelay = index * 0.5;
            item.style.animation = `float 3s ease-in-out infinite ${animationDelay}s`;
        });

        // Add floating keyframes
        if (!document.querySelector('#floating-animation')) {
            const style = document.createElement('style');
            style.id = 'floating-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize floating animation
    initializeFloatingAnimation();

    // Add particle effect to hero section (optional)
    function initializeParticleEffect() {
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            // Create particle container
            const particleContainer = document.createElement('div');
            particleContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
            `;
            
            // Create particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    animation: float-particle ${3 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                particleContainer.appendChild(particle);
            }
            
            heroSection.appendChild(particleContainer);
            
            // Add particle animation keyframes
            if (!document.querySelector('#particle-animation')) {
                const style = document.createElement('style');
                style.id = 'particle-animation';
                style.textContent = `
                    @keyframes float-particle {
                        0%, 100% { 
                            transform: translateY(0px) translateX(0px);
                            opacity: 0.3;
                        }
                        50% { 
                            transform: translateY(-20px) translateX(10px);
                            opacity: 0.8;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Uncomment to enable particle effect
    // initializeParticleEffect();

    // Add smooth page transitions
    function initializePageTransitions() {
        // Add fade-in effect to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 100);
        }
    }

    // Initialize page transitions
    initializePageTransitions();

    // Add keyboard navigation support
    function initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key to close any open modals or menus
            if (e.key === 'Escape') {
                // Add escape key functionality here if needed
                console.log('Escape key pressed');
            }
        });
    }

    // Initialize keyboard navigation
    initializeKeyboardNavigation();

    // Add performance monitoring
    function initializePerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`About page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track Core Web Vitals
            if ('web-vital' in window) {
                // Add web vitals tracking here if needed
                console.log('Web vitals tracking available');
            }
        });
    }

    // Initialize performance monitoring
    initializePerformanceMonitoring();

    // Add accessibility enhancements
    function initializeAccessibilityEnhancements() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const mainContent = document.querySelector('.main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    // Initialize accessibility enhancements
    initializeAccessibilityEnhancements();

    // Add print styles optimization
    function initializePrintOptimization() {
        window.addEventListener('beforeprint', () => {
            // Hide interactive elements before printing
            const interactiveElements = document.querySelectorAll('.social-link, .btn');
            interactiveElements.forEach(el => {
                el.style.display = 'none';
            });
        });
        
        window.addEventListener('afterprint', () => {
            // Restore interactive elements after printing
            const interactiveElements = document.querySelectorAll('.social-link, .btn');
            interactiveElements.forEach(el => {
                el.style.display = '';
            });
        });
    }

    // Initialize print optimization
    initializePrintOptimization();
});