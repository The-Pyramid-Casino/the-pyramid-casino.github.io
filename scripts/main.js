/**
 * Main Application JavaScript
 * Handles global functionality, navigation, and page-specific features
 */

class PyramidCasino {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
        } else {
            this.onDOMLoaded();
        }
    }
    
    onDOMLoaded() {
        this.initNavigation();
        this.initAnimations();
        this.initAccessibility();
        this.initPageSpecificFeatures();
        this.initNotifications();
    }
    
    initNavigation() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                this.updateNavToggleIcon(navToggle, navMenu.classList.contains('active'));
            });
        }
        
        // Close mobile nav when clicking links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        this.updateNavToggleIcon(navToggle, false);
                    }
                }
            });
        });
        
        // Update active navigation link
        this.updateActiveNavLink();
    }
    
    updateNavToggleIcon(toggle, isActive) {
        const spans = toggle.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
    
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature-card, .game-card, .stat-item');
        animateElements.forEach(el => observer.observe(el));
        
        // Counter animation for stats
        this.animateCounters();
        
        // Smooth scroll for anchor links
        this.initSmoothScroll();
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            requestAnimationFrame(updateCounter);
        };
        
        // Start animation when stat section comes into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number[data-count]');
                    statNumbers.forEach(counter => animateCounter(counter));
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }
    
    initSmoothScroll() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initAccessibility() {
        // Keyboard navigation for custom elements
        this.initKeyboardNavigation();
        
        // Skip link functionality
        this.initSkipLink();
        
        // Focus management for modals and dropdowns
        this.initFocusManagement();
        
        // ARIA live regions for dynamic content
        this.initLiveRegions();
    }
    
    initKeyboardNavigation() {
        // Handle Enter and Space key presses on custom buttons
        const customButtons = document.querySelectorAll('[role=\"button\"]:not(button)');
        customButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
        
        // Escape key to close dropdowns and modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeAllModals();
            }
        });
    }
    
    initSkipLink() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }
    }
    
    initFocusManagement() {
        // Trap focus in modals when they're open
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.trapFocus(e, activeModal);
                }
            }
        });
    }
    
    trapFocus(event, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
    
    initLiveRegions() {
        // Create live region for announcements
        if (!document.getElementById('announcements')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }
    
    announce(message) {
        const announcements = document.getElementById('announcements');
        if (announcements) {
            announcements.textContent = message;
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }
    
    initPageSpecificFeatures() {
        const path = window.location.pathname;
        
        // Home page specific features
        if (path.includes('index.html') || path === '/') {
            this.initHomePage();
        }
        
        // Games page specific features
        if (path.includes('games.html')) {
            this.initGamesPage();
        }
        
        // Auth pages specific features
        if (path.includes('login.html') || path.includes('signup.html')) {
            this.initAuthPages();
        }
    }
    
    initHomePage() {
        // Hero CTA button analytics
        const ctaButtons = document.querySelectorAll('.hero-actions .btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('cta_click', {
                    location: 'hero',
                    text: button.textContent.trim()
                });
            });
        });
        
        // Feature card interactions
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px) scale(1)';
            });
        });
    }
    
    initGamesPage() {
        // Game filtering and searching functionality would go here
        this.initGameFilters();
        this.initGameSearch();
    }
    
    initGameFilters() {
        // Implementation for game category filtering
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                this.filterGames(category);
            });
        });
    }
    
    initGameSearch() {
        // Implementation for game search functionality
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchGames(e.target.value);
                }, 300);
            });
        }
    }
    
    filterGames(category) {
        // Filter games by category
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const gameCategory = card.getAttribute('data-category');
            if (category === 'all' || gameCategory === category) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
        
        this.announce(`Showing ${category === 'all' ? 'all' : category} games`);
    }
    
    searchGames(query) {
        // Search games by name or description
        const gameCards = document.querySelectorAll('.game-card');
        const lowerQuery = query.toLowerCase();
        
        gameCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
        
        this.announce(`Search results for: ${query}`);
    }
    
    initAuthPages() {
        // Form validation and submission
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
        
        // Real-time password validation
        const passwordInputs = document.querySelectorAll('input[type=\"password\"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validatePasswordStrength(input);
            });
        });
    }
    
    handleFormSubmission(form) {
        // Form submission handling would be implemented here
        console.log('Form submitted:', form.id);
    }
    
    validatePasswordStrength(input) {
        // Password strength validation would be implemented here
        const strength = this.calculatePasswordStrength(input.value);
        this.showPasswordStrength(input, strength);
    }
    
    calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        return score;
    }
    
    showPasswordStrength(input, strength) {
        // Visual password strength indicator
        let strengthText = '';
        let strengthClass = '';
        
        switch (strength) {
            case 0:
            case 1:
                strengthText = 'Very Weak';
                strengthClass = 'very-weak';
                break;
            case 2:
                strengthText = 'Weak';
                strengthClass = 'weak';
                break;
            case 3:
                strengthText = 'Fair';
                strengthClass = 'fair';
                break;
            case 4:
                strengthText = 'Good';
                strengthClass = 'good';
                break;
            case 5:
                strengthText = 'Strong';
                strengthClass = 'strong';
                break;
        }
        
        // Update strength indicator (would need corresponding HTML element)
        const strengthIndicator = input.parentNode.querySelector('.password-strength');
        if (strengthIndicator) {
            strengthIndicator.textContent = strengthText;
            strengthIndicator.className = `password-strength ${strengthClass}`;
        }
    }
    
    initNotifications() {
        // Toast notification system
        this.createNotificationContainer();
    }
    
    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class=\"notification-content\">
                <i class=\"fas fa-${this.getNotificationIcon(type)}\"></i>
                <span>${message}</span>
            </div>
            <button class=\"notification-close\" aria-label=\"Close notification\">
                <i class=\"fas fa-times\"></i>
            </button>
        `;
        
        // Add event listener for close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }
    
    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
    
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.user-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        });
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (window.authManager) {
            window.authManager.trackEvent(eventName, data);
        }
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application
window.pyramidCasino = new PyramidCasino();

// Global utility functions
window.showFAQ = () => {
    alert('FAQ section coming soon!');
};

window.showContact = () => {
    alert('Contact form coming soon!');
};

window.showTerms = () => {
    alert('Terms of Service coming soon!');
};

window.showPrivacy = () => {
    alert('Privacy Policy coming soon!');
};

// Service worker registration for PWA (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker not available
        });
    });
}