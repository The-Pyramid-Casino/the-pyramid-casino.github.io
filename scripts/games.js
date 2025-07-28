/**
 * Games Page JavaScript
 * Handles game filtering, searching, and interaction
 */

class GamesManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.gamesData = [];
        this.init();
    }
    
    init() {
        this.loadGamesData();
        this.initEventListeners();
        this.initAccessibility();
        this.checkAuthStatus();
    }
    
    loadGamesData() {
        // Extract game data from DOM
        const gameCards = document.querySelectorAll('.game-card');
        this.gamesData = Array.from(gameCards).map(card => ({
            element: card,
            title: card.querySelector('h3').textContent.toLowerCase(),
            description: card.querySelector('p').textContent.toLowerCase(),
            category: card.getAttribute('data-category'),
            available: !card.querySelector('.game-status.coming-soon'),
            rating: card.querySelector('.game-rating') ? 
                parseFloat(card.querySelector('.game-rating').textContent.match(/[\d.]+/)?.[0] || '0') : 0
        }));
    }
    
    initEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.getAttribute('data-category');
                this.setFilter(category);
                
                // Update button states
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            });
        });
        
        // Search input
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.setSearch(e.target.value);
                }, 300);
            });
            
            // Clear search on escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.setSearch('');
                }
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
        
        // Game card interactions
        this.initGameCardEvents();
    }
    
    initGameCardEvents() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            // Hover effects for analytics
            card.addEventListener('mouseenter', () => {
                const gameTitle = card.querySelector('h3').textContent;
                this.trackEvent('game_hover', { game: gameTitle });
            });
            
            // Click analytics for play buttons
            const playButton = card.querySelector('.btn');
            if (playButton && !playButton.disabled) {
                playButton.addEventListener('click', (e) => {
                    const gameTitle = card.querySelector('h3').textContent;
                    const gameCategory = card.getAttribute('data-category');
                    
                    // Check if user is logged in
                    if (window.authManager && !window.authManager.isLoggedIn()) {
                        e.preventDefault();
                        this.showLoginPrompt(gameTitle);
                        return;
                    }
                    
                    this.trackEvent('game_play_click', { 
                        game: gameTitle, 
                        category: gameCategory 
                    });
                });
            }
        });
    }
    
    setFilter(category) {
        this.currentFilter = category;
        this.applyFilters();
        
        // Analytics
        this.trackEvent('games_filter', { category });
        
        // Accessibility announcement
        const count = this.getVisibleGamesCount();
        this.announce(`Showing ${count} ${category === 'all' ? '' : category} games`);
    }
    
    setSearch(query) {
        this.currentSearch = query.toLowerCase().trim();
        this.applyFilters();
        
        // Analytics
        if (this.currentSearch) {
            this.trackEvent('games_search', { query: this.currentSearch });
        }
        
        // Accessibility announcement
        const count = this.getVisibleGamesCount();
        if (this.currentSearch) {
            this.announce(`Found ${count} games matching "${query}"`);
        }
    }
    
    applyFilters() {
        let visibleCount = 0;
        
        this.gamesData.forEach(game => {
            let visible = true;
            
            // Category filter
            if (this.currentFilter !== 'all' && game.category !== this.currentFilter) {
                visible = false;
            }
            
            // Search filter
            if (this.currentSearch && 
                !game.title.includes(this.currentSearch) && 
                !game.description.includes(this.currentSearch)) {
                visible = false;
            }
            
            // Apply visibility
            if (visible) {
                this.showGameCard(game.element);
                visibleCount++;
            } else {
                this.hideGameCard(game.element);
            }
        });
        
        // Show/hide no games message
        this.toggleNoGamesMessage(visibleCount === 0);
    }
    
    showGameCard(element) {
        element.style.display = 'block';
        element.classList.remove('fade-out');
        element.classList.add('fade-in');
    }
    
    hideGameCard(element) {
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
        setTimeout(() => {
            if (element.classList.contains('fade-out')) {
                element.style.display = 'none';
            }
        }, 300);
    }
    
    toggleNoGamesMessage(show) {
        const noGamesMessage = document.getElementById('noGamesMessage');
        if (noGamesMessage) {
            if (show) {
                noGamesMessage.classList.remove('hidden');
            } else {
                noGamesMessage.classList.add('hidden');
            }
        }
    }
    
    getVisibleGamesCount() {
        return this.gamesData.filter(game => {
            let visible = true;
            
            if (this.currentFilter !== 'all' && game.category !== this.currentFilter) {
                visible = false;
            }
            
            if (this.currentSearch && 
                !game.title.includes(this.currentSearch) && 
                !game.description.includes(this.currentSearch)) {
                visible = false;
            }
            
            return visible;
        }).length;
    }
    
    clearFilters() {
        // Reset filter
        this.currentFilter = 'all';
        const allButton = document.querySelector('.filter-btn[data-category="all"]');
        if (allButton) {
            allButton.click();
        }
        
        // Reset search
        this.currentSearch = '';
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Apply filters
        this.applyFilters();
        
        // Analytics
        this.trackEvent('games_filters_cleared');
        
        // Accessibility announcement
        this.announce('All filters cleared, showing all games');
    }
    
    showLoginPrompt(gameTitle) {
        if (window.pyramidCasino) {
            window.pyramidCasino.showNotification(
                `Please log in to play ${gameTitle}. <a href="login.html" style="color: var(--primary-light); text-decoration: underline;">Log in here</a>`,
                'info',
                7000
            );
        }
        
        // Analytics
        this.trackEvent('login_prompt_shown', { game: gameTitle });
    }
    
    checkAuthStatus() {
        // Show different UI based on auth status
        if (window.authManager && window.authManager.isLoggedIn()) {
            this.showAuthenticatedUI();
        } else {
            this.showUnauthenticatedUI();
        }
    }
    
    showAuthenticatedUI() {
        // Add welcome message or user-specific content
        const user = window.authManager.getCurrentUser();
        if (user) {
            this.trackEvent('games_page_view_authenticated', { 
                username: user.username,
                level: user.level 
            });
        }
    }
    
    showUnauthenticatedUI() {
        // Add login prompts or guest mode indicators
        this.trackEvent('games_page_view_guest');
        
        // Show info about creating account
        setTimeout(() => {
            if (window.pyramidCasino) {
                window.pyramidCasino.showNotification(
                    'Create a free account to track your progress and unlock achievements!',
                    'info',
                    5000
                );
            }
        }, 3000);
    }
    
    initAccessibility() {
        // Keyboard navigation for filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                let targetIndex = index;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = index > 0 ? index - 1 : filterButtons.length - 1;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = index < filterButtons.length - 1 ? index + 1 : 0;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = filterButtons.length - 1;
                        break;
                    default:
                        return;
                }
                
                filterButtons[targetIndex].focus();
            });
        });
        
        // Skip to games link
        this.addSkipToGamesLink();
    }
    
    addSkipToGamesLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#gamesGrid';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to games';
        skipLink.style.position = 'absolute';
        skipLink.style.top = '-40px';
        skipLink.style.left = '6px';
        skipLink.style.background = 'var(--primary-color)';
        skipLink.style.color = 'var(--text-inverse)';
        skipLink.style.padding = '8px';
        skipLink.style.textDecoration = 'none';
        skipLink.style.borderRadius = 'var(--radius-md)';
        skipLink.style.zIndex = 'var(--z-tooltip)';
        skipLink.style.transition = 'top var(--transition-fast)';
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '90px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.appendChild(skipLink);
    }
    

    
    getGameRecommendations() {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            return this.getPopularGames();
        }
        
        const user = window.authManager.getCurrentUser();
        
        // Simple recommendation based on user stats
        if (user.stats && user.stats.favoriteGame) {
            const favoriteCategory = this.gamesData.find(game => 
                game.title.includes(user.stats.favoriteGame)
            )?.category;
            
            if (favoriteCategory) {
                return this.gamesData
                    .filter(game => game.category === favoriteCategory && game.available)
                    .slice(0, 4);
            }
        }
        
        return this.getPopularGames();
    }
    
    getPopularGames() {
        return this.gamesData
            .filter(game => game.available)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);
    }
    
    showGameTooltip(gameElement, info) {
        // Create and show tooltip with game info
        const tooltip = document.createElement('div');
        tooltip.className = 'game-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${info.title}</h4>
                <p>Category: ${info.category}</p>
                <p>Rating: ${info.rating}/5</p>
                <p>Status: ${info.available ? 'Available' : 'Coming Soon'}</p>
            </div>
        `;
        
        // Position and show tooltip
        document.body.appendChild(tooltip);
        
        // Remove tooltip after delay
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }
    
    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (window.authManager) {
            window.authManager.trackEvent(eventName, data);
        }
        
        // Console log for development
        console.log('Games Event:', eventName, data);
    }
    
    announce(message) {
        // Accessibility announcements
        if (window.pyramidCasino) {
            window.pyramidCasino.announce(message);
        }
    }
    
    // Public API methods
    filterByCategory(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    }
    
    searchGames(query) {
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) {
            searchInput.value = query;
            this.setSearch(query);
        }
    }
    
    getStats() {
        return {
            totalGames: this.gamesData.length,
            availableGames: this.gamesData.filter(g => g.available).length,
            comingSoonGames: this.gamesData.filter(g => !g.available).length,
            categories: [...new Set(this.gamesData.map(g => g.category))],
            averageRating: this.gamesData.reduce((sum, g) => sum + g.rating, 0) / this.gamesData.length
        };
    }
}

// Initialize games manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gamesManager = new GamesManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamesManager;
}