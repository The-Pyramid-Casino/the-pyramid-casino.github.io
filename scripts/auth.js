/**
 * Authentication System
 * Handles user registration, login, logout, and session management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Load current user from storage
        this.loadCurrentUser();
        
        // Update UI based on auth state
        this.updateAuthUI();
        
        // Add event listeners
        this.addEventListeners();
    }
    
    addEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // User menu toggle
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }
        
        // Close user menu when clicking outside
        document.addEventListener('click', () => {
            this.closeUserMenu();
        });
    }
    
    loadCurrentUser() {
        const userData = localStorage.getItem('pyramid-casino-user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
                localStorage.removeItem('pyramid-casino-user');
            }
        }
    }
    
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('pyramid-casino-user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('pyramid-casino-user');
        }
    }
    
    register(userData) {
        // Validate required fields
        if (!userData.username || !userData.email || !userData.password) {
            throw new Error('Please fill in all required fields');
        }
        
        // Check if user already exists
        const existingUsers = this.getAllUsers();
        if (existingUsers.find(user => user.username === userData.username)) {
            throw new Error('Username already exists');
        }
        if (existingUsers.find(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }
        
        // Validate password strength
        if (!this.validatePassword(userData.password)) {
            throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
        }
        
        // Create new user
        const newUser = {
            id: this.generateUserId(),
            username: userData.username,
            email: userData.email,
            password: this.hashPassword(userData.password), // In real app, use proper hashing
            balance: 1000.00, // Starting balance
            xp: 0,
            level: 1,
            achievements: [],
            registeredAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            settings: {
                theme: 'auto',
                notifications: true,
                autoPlay: false
            },
            stats: {
                gamesPlayed: 0,
                totalWon: 0,
                totalLost: 0,
                favoriteGame: null
            }
        };
        
        // Save user
        existingUsers.push(newUser);
        localStorage.setItem('pyramid-casino-users', JSON.stringify(existingUsers));
        
        // Auto-login the new user
        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateAuthUI();
        
        // Track registration
        this.trackEvent('user_registered', { username: newUser.username });
        
        return newUser;
    }
    
    login(username, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.username === username || u.email === username);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.password !== this.hashPassword(password)) {
            throw new Error('Invalid password');
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.updateUser(user);
        
        // Set current user
        this.currentUser = user;
        this.saveCurrentUser();
        this.updateAuthUI();
        
        // Track login
        this.trackEvent('user_login', { username: user.username });
        
        return user;
    }
    
    logout() {
        if (this.currentUser) {
            this.trackEvent('user_logout', { username: this.currentUser.username });
        }
        
        this.currentUser = null;
        this.saveCurrentUser();
        this.updateAuthUI();
        
        // Redirect to home page
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }
    
    updateAuthUI() {
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');
        const usernameSpan = document.getElementById('username');
        const balanceSpan = document.getElementById('userBalance');
        
        if (this.currentUser) {
            // User is logged in
            if (authSection) authSection.classList.add('hidden');
            if (userSection) userSection.classList.remove('hidden');
            if (usernameSpan) usernameSpan.textContent = this.currentUser.username;
            if (balanceSpan) balanceSpan.textContent = this.formatCurrency(this.currentUser.balance);
        } else {
            // User is not logged in
            if (authSection) authSection.classList.remove('hidden');
            if (userSection) userSection.classList.add('hidden');
        }
    }
    
    toggleUserMenu() {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.style.opacity = userDropdown.style.opacity === '1' ? '0' : '1';
            userDropdown.style.visibility = userDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
        }
    }
    
    closeUserMenu() {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
        }
    }
    
    updateBalance(amount) {
        if (!this.currentUser) return false;
        
        this.currentUser.balance += amount;
        this.saveCurrentUser();
        this.updateUser(this.currentUser);
        this.updateAuthUI();
        
        // Track transaction
        this.addTransaction({
            type: amount > 0 ? 'credit' : 'debit',
            amount: Math.abs(amount),
            description: amount > 0 ? 'Account Credit' : 'Game Debit',
            timestamp: new Date().toISOString()
        });
        
        return true;
    }
    
    addTransaction(transaction) {
        if (!this.currentUser) return;
        
        const transactions = this.getTransactions();
        transaction.id = this.generateTransactionId();
        transaction.userId = this.currentUser.id;
        transactions.unshift(transaction); // Add to beginning
        
        // Keep only last 100 transactions
        if (transactions.length > 100) {
            transactions.splice(100);
        }
        
        localStorage.setItem('pyramid-casino-transactions', JSON.stringify(transactions));
    }
    
    getTransactions() {
        const transactions = localStorage.getItem('pyramid-casino-transactions');
        return transactions ? JSON.parse(transactions) : [];
    }
    
    getUserTransactions() {
        if (!this.currentUser) return [];
        return this.getTransactions().filter(t => t.userId === this.currentUser.id);
    }
    
    addXP(amount) {
        if (!this.currentUser) return;
        
        this.currentUser.xp += amount;
        
        // Check for level up
        const newLevel = this.calculateLevel(this.currentUser.xp);
        if (newLevel > this.currentUser.level) {
            this.currentUser.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }
        
        this.saveCurrentUser();
        this.updateUser(this.currentUser);
    }
    
    calculateLevel(xp) {
        return Math.floor(xp / 1000) + 1;
    }
    
    showLevelUpNotification(level) {
        // This would show a notification - implement based on UI needs
        console.log(`Congratulations! You reached level ${level}!`);
    }
    
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }
    
    hashPassword(password) {
        // Simple hash for demo - use proper hashing in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }
    
    generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    generateTransactionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getAllUsers() {
        const users = localStorage.getItem('pyramid-casino-users');
        return users ? JSON.parse(users) : [];
    }
    
    updateUser(updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('pyramid-casino-users', JSON.stringify(users));
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    trackEvent(eventName, data = {}) {
        // Analytics tracking - implement based on needs
        console.log('Event:', eventName, data);
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}