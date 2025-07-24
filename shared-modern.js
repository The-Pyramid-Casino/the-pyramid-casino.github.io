/* Shared Modern JavaScript for Pyramid Casino */

// Enhanced Engagement System - Creates compelling near-miss experiences
// Advanced random system with near-miss generation for entertainment
function riggedRandom(houseEdgePercentage = 2.5) {
    // Generate base random number
    let random = Math.random();
    
    // Apply subtle house bias by shifting the distribution slightly
    // This reduces player's favorable outcomes by the house edge percentage
    const bias = houseEdgePercentage / 100;
    
    // Shift the random number slightly towards values that favor the house
    // For most games, lower random numbers tend to be less favorable to players
    random = random * (1 - bias) + (random * random * bias);
    
    return random;
}

// Near-miss generation system for enhanced engagement
function generateNearMiss(winThreshold = 0.5, nearMissChance = 0.3) {
    const random = Math.random();
    
    // If would be a loss, chance to make it a near-miss instead
    if (random > winThreshold && Math.random() < nearMissChance) {
        // Generate a number very close to the win threshold
        const nearMissOffset = (Math.random() * 0.05) + 0.01; // Very close but not quite
        return winThreshold - nearMissOffset;
    }
    
    return random;
}

// Enhanced slots near-miss system
function generateSlotsNearMiss() {
    const baseRandom = riggedRandom(3.0); // Slightly higher house edge for slots
    
    // 25% chance to create a near-miss scenario on losses
    if (baseRandom > 0.4 && Math.random() < 0.25) {
        // Create scenarios where 2 out of 3 symbols match
        return {
            isNearMiss: true,
            type: 'two_of_three',
            excitement: Math.random() * 0.5 + 0.3 // Moderate to high excitement
        };
    }
    
    // 15% chance for "just missed jackpot" scenarios
    if (baseRandom > 0.85 && Math.random() < 0.15) {
        return {
            isNearMiss: true,
            type: 'jackpot_miss',
            excitement: Math.random() * 0.3 + 0.7 // High excitement
        };
    }
    
    return {
        isNearMiss: false,
        baseRandom: baseRandom
    };
}

// Rigged random for integer ranges with house bias
function riggedRandomInt(min, max, houseEdgePercentage = 2.5) {
    const random = riggedRandom(houseEdgePercentage);
    return Math.floor(random * (max - min + 1)) + min;
}

// Rigged coin flip - slightly favors house  
function riggedCoinFlip(houseEdgePercentage = 3.0) {
    // Simple bias: make it slightly less than 50% chance for player win
    return riggedRandom(houseEdgePercentage) < (0.5 - houseEdgePercentage / 200);
}

// Array shuffle with subtle house bias
function riggedShuffle(array, houseEdgePercentage = 1.5) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Use rigged random for Fisher-Yates shuffle
        const j = Math.floor(riggedRandom(houseEdgePercentage) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

// WCAG Compliant Instructions modal functionality
function createInstructionsModal(gameTitle, instructions) {
    // Remove existing modal if any
    const existingModal = document.getElementById('instructions-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Store the focused element before opening modal
    const previouslyFocusedElement = document.activeElement;

    // Create modal HTML with WCAG compliance
    const modal = document.createElement('div');
    modal.id = 'instructions-modal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.setAttribute('aria-describedby', 'modal-body');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">🎯 ${gameTitle} Instructions</h2>
                <button class="close" aria-label="Close instructions dialog">&times;</button>
            </div>
            <div id="modal-body" class="modal-body">
                ${instructions}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trap focus within modal for accessibility
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    function trapFocus(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
    
    function closeModal() {
        modal.style.display = 'none';
        modal.removeEventListener('keydown', trapFocus);
        document.removeEventListener('keydown', handleEscape);
        // Return focus to previously focused element
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }
    
    function handleEscape(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = closeModal;
    closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });
    
    // Close when clicking outside the modal
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Add event listeners for accessibility
    modal.addEventListener('keydown', trapFocus);
    document.addEventListener('keydown', handleEscape);
    
    return modal;
}

function showInstructions(gameTitle, instructions) {
    const modal = createInstructionsModal(gameTitle, instructions);
    modal.style.display = 'block';
    
    // Force a reflow then start animation
    modal.offsetHeight;
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.opacity = '1';
    modalContent.style.transform = 'scale(1) translateY(0)';
    
    // Focus the close button for accessibility
    const closeBtn = modal.querySelector('.close');
    closeBtn.focus();
    
    // Announce modal opening to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${gameTitle} instructions dialog opened`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.remove();
        }
    }, 1000);
}

// Enhanced animations
function addCardFlipAnimation(cardElement) {
    cardElement.classList.add('new-card');
    setTimeout(function() {
        cardElement.classList.remove('new-card');
    }, 600);
}

function addChipDropAnimation(chipElement) {
    chipElement.classList.add('chip-drop');
    setTimeout(function() {
        chipElement.classList.remove('chip-drop');
    }, 800);
}

// Enhanced balance update with animation
function updateBalanceWithAnimation(balanceElement, newBalance) {
    var currentBalance = parseInt(balanceElement.textContent);
    var difference = newBalance - currentBalance;
    
    // Add visual feedback for wins/losses
    if (difference > 0) {
        balanceElement.style.color = '#43c734';
        balanceElement.style.textShadow = '0 0 10px rgba(67, 199, 52, 0.5)';
    } else if (difference < 0) {
        balanceElement.style.color = '#d7263d';
        balanceElement.style.textShadow = '0 0 10px rgba(215, 38, 61, 0.5)';
    }
    
    // Animate the number change
    var duration = 500;
    var steps = 20;
    var stepValue = difference / steps;
    var currentStep = 0;
    
    var interval = setInterval(function() {
        currentStep++;
        var displayValue = Math.round(currentBalance + (stepValue * currentStep));
        balanceElement.textContent = displayValue;
        
        if (currentStep >= steps) {
            clearInterval(interval);
            balanceElement.textContent = newBalance;
            
            // Reset color after animation
            setTimeout(function() {
                balanceElement.style.color = '';
                balanceElement.style.textShadow = '';
            }, 1000);
        }
    }, duration / steps);
}

// Enhanced notification system with WCAG compliance and modern positioning
function showNotification(message, type, duration) {
    if (typeof type === 'undefined') type = 'info';
    if (typeof duration === 'undefined') duration = 3000;
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.game-notification');
    for (let i = 0; i < existingNotifications.length; i++) {
        existingNotifications[i].remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'game-notification notification-' + type;
    notification.innerHTML = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    
    const styles = {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '0.95rem',
        zIndex: '9999',
        minWidth: '280px',
        maxWidth: '400px',
        textAlign: 'left',
        animation: 'slideInLeft 0.4s ease-out',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        webkitBackdropFilter: 'blur(20px)'
    };
    
    // Type-specific styling with improved contrast and modern design
    switch(type) {
        case 'win':
            styles.background = 'rgba(34, 197, 94, 0.9)';
            styles.color = '#ffffff';
            styles.borderColor = 'rgba(34, 197, 94, 0.3)';
            break;
        case 'lose':
            styles.background = 'rgba(239, 68, 68, 0.9)';
            styles.color = '#ffffff';
            styles.borderColor = 'rgba(239, 68, 68, 0.3)';
            break;
        case 'near-miss':
            styles.background = 'rgba(251, 146, 60, 0.9)';
            styles.color = '#ffffff';
            styles.borderColor = 'rgba(251, 146, 60, 0.3)';
            styles.animation = 'pulseGlow 0.8s ease-out';
            break;
        case 'achievement':
            styles.background = 'rgba(147, 51, 234, 0.9)';
            styles.color = '#ffffff';
            styles.borderColor = 'rgba(147, 51, 234, 0.3)';
            styles.animation = 'bounceIn 0.6s ease-out';
            break;
        case 'info':
            styles.background = 'rgba(59, 130, 246, 0.9)';
            styles.color = '#ffffff';
            styles.borderColor = 'rgba(59, 130, 246, 0.3)';
            break;
        default:
            styles.background = 'rgba(75, 85, 99, 0.9)';
            styles.color = '#ffffff';
            styles.borderColor = 'rgba(156, 163, 175, 0.3)';
    }
    
    Object.assign(notification.style, styles);
    document.body.appendChild(notification);
    
    // Add modern animations
    if (!document.querySelector('#modern-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'modern-notification-styles';
        style.textContent = `
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutLeft {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-100%);
                    opacity: 0;
                }
            }
            
            @keyframes pulseGlow {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 15px 50px rgba(251, 146, 60, 0.4);
                }
            }
            
            @keyframes bounceIn {
                0% {
                    transform: scale(0.3) translateX(-100%);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1) translateX(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove after duration
    setTimeout(function() {
        notification.style.animation = 'slideOutLeft 0.4s ease-out';
        setTimeout(function() { 
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, duration);
}

// Session and Engagement Tracking System (without streaks)
const SESSION_STORAGE_KEY = 'pyramidCasinoSession';
const ACHIEVEMENTS_KEY = 'pyramidCasinoAchievements';

// Track player session for engagement features
function getPlayerSession() {
    try {
        const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionData) {
            return JSON.parse(sessionData);
        }
        return {
            startTime: Date.now(),
            totalPlayTime: 0,
            gamesPlayed: 0,
            consecutiveLosses: 0,
            nearMissCount: 0,
            lastNearMiss: 0,
            totalBets: 0,
            totalWins: 0,
            dailyPlayTime: {},
            engagementLevel: 'new' // new, casual, engaged, hooked
        };
    } catch (e) {
        console.error('Error loading session data:', e);
        return getPlayerSession(); // Return default
    }
}

function updatePlayerSession(updates) {
    try {
        const session = getPlayerSession();
        Object.assign(session, updates);
        
        // Update engagement level based on play patterns
        const playTime = session.totalPlayTime / (1000 * 60); // minutes
        const gamesPerMinute = playTime > 0 ? session.gamesPlayed / playTime : 0;
        
        if (playTime > 60 && gamesPerMinute > 0.5) {
            session.engagementLevel = 'hooked';
        } else if (playTime > 30 && session.gamesPlayed > 20) {
            session.engagementLevel = 'engaged';
        } else if (session.gamesPlayed > 5) {
            session.engagementLevel = 'casual';
        }
        
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        
        // Check for achievements
        checkAchievements(session);
        
        return session;
    } catch (e) {
        console.error('Error updating session data:', e);
        return getPlayerSession();
    }
}

// Achievement System for Engagement (without streak achievements)
function checkAchievements(session) {
    const achievements = getAchievements();
    
    // First time player
    if (session.gamesPlayed === 1 && !achievements.firstGame) {
        unlockAchievement('firstGame', '🎮 Welcome!', 'Played your first game at Pyramid Casino!');
    }
    
    // Near miss milestone
    if (session.nearMissCount >= 10 && !achievements.nearMissHunter) {
        unlockAchievement('nearMissHunter', '🎯 So Close!', 'Experienced 10 near-miss moments!');
    }
    
    // Play time milestones
    const playTimeMinutes = session.totalPlayTime / (1000 * 60);
    if (playTimeMinutes >= 30 && !achievements.dedicatedPlayer) {
        unlockAchievement('dedicatedPlayer', '⏰ Dedicated Player', '30 minutes of exciting gameplay!');
    }
    
    // Consecutive losses (encouragement)
    if (session.consecutiveLosses >= 5 && !achievements.persistent) {
        unlockAchievement('persistent', '💪 Never Give Up', 'Your luck is about to turn around!');
        // Give a small consolation bonus
        const bonusAmount = Math.min(50, Math.floor(getCasinoBalance() * 0.05));
        if (bonusAmount > 0) {
            updateBalance(bonusAmount, 'bonus', 'Persistence bonus');
            showNotification(`🎁 Persistence Bonus: +${bonusAmount} chips!`, 'achievement', 4000);
        }
    }
    
    // Games played milestones
    if (session.gamesPlayed >= 50 && !achievements.gamingMaster) {
        unlockAchievement('gamingMaster', '🏆 Gaming Master', 'Played 50 games at Pyramid Casino!');
    }
}

function getAchievements() {
    try {
        const achievementsData = localStorage.getItem(ACHIEVEMENTS_KEY);
        if (achievementsData) {
            return JSON.parse(achievementsData);
        }
        return {};
    } catch (e) {
        console.error('Error loading achievements:', e);
        return {};
    }
}

function unlockAchievement(achievementId, title, description) {
    try {
        const achievements = getAchievements();
        if (!achievements[achievementId]) {
            achievements[achievementId] = {
                unlocked: true,
                timestamp: Date.now(),
                title: title,
                description: description
            };
            localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
            
            // Show achievement notification
            showNotification(`${title}<br><small>${description}</small>`, 'achievement', 5000);
        }
    } catch (e) {
        console.error('Error unlocking achievement:', e);
    }
}

// Near-Miss Feedback System
function handleNearMiss(game, type, excitement = 0.5) {
    const session = updatePlayerSession({
        nearMissCount: getPlayerSession().nearMissCount + 1,
        lastNearMiss: Date.now()
    });
    
    // Generate appropriate near-miss message
    let message = '';
    let suggestions = '';
    
    switch (type) {
        case 'two_of_three':
            message = '🎯 SO CLOSE! Two matching symbols!';
            suggestions = 'The jackpot is calling your name!';
            break;
        case 'jackpot_miss':
            message = '💫 ALMOST JACKPOT! Just one symbol away!';
            suggestions = 'Your big win is right around the corner!';
            break;
        case 'blackjack_19_20':
            message = '🃏 SO CLOSE! Just one point away from 21!';
            suggestions = 'You\'re getting better at this!';
            break;
        case 'roulette_adjacent':
            message = '🎯 ALMOST! The ball was so close to your number!';
            suggestions = 'Lady luck is smiling at you!';
            break;
        default:
            message = '✨ CLOSE CALL! You\'re getting warmer!';
            suggestions = 'Keep going, you\'re on the right track!';
    }
    
    // Show near-miss notification with excitement
    const fullMessage = `${message}<br><small>${suggestions}</small>`;
    showNotification(fullMessage, 'near-miss', 4000);
    
    // Suggest slightly higher bet if engagement is high
    if (excitement > 0.7 && session.engagementLevel === 'engaged' || session.engagementLevel === 'hooked') {
        setTimeout(() => {
            const currentBalance = getCasinoBalance();
            if (currentBalance > 100) {
                const suggestedBet = Math.min(Math.floor(currentBalance * 0.1), 100);
                showNotification(`💡 Feeling lucky? Try a ${suggestedBet} chip bet next!`, 'info', 3000);
            }
        }, 2000);
    }
}

// Enhanced button click effects
function addButtonClickEffect(button) {
    button.addEventListener('click', function(e) {
        var ripple = document.createElement('span');
        var rect = button.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = 
            'position: absolute;' +
            'width: ' + size + 'px;' +
            'height: ' + size + 'px;' +
            'left: ' + x + 'px;' +
            'top: ' + y + 'px;' +
            'background: rgba(255, 255, 255, 0.3);' +
            'border-radius: 50%;' +
            'transform: scale(0);' +
            'animation: ripple 0.6s ease-out;' +
            'pointer-events: none;';
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-style')) {
            var style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = 
                '@keyframes ripple {' +
                    'to {' +
                        'transform: scale(2);' +
                        'opacity: 0;' +
                    '}' +
                '}';
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(function() { 
            ripple.remove(); 
        }, 600);
    });
}

// Load admin configuration if available
function loadAdminConfig() {
    try {
        // Try to load admin-config.js dynamically
        var script = document.createElement('script');
        script.src = 'admin-config.js';
        script.async = false;
        script.onload = function() {
            console.log('Admin configuration loaded successfully');
            
            // Check if there's a stored admin session
            if (typeof isAdminMode !== 'undefined' && isAdminMode()) {
                console.log('Previous admin session detected');
                if (typeof showAdminModeIndicator !== 'undefined') {
                    showAdminModeIndicator();
                }
            }
        };
        script.onerror = function() {
            // Admin config not available - this is fine for regular users
            console.log('Admin configuration not available');
        };
        document.head.appendChild(script);
    } catch (e) {
        console.log('Could not load admin configuration:', e.message);
    }
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load admin config if available
    loadAdminConfig();
    
    // Initialize anti-cheat system first
    if (!initializeAntiCheat()) {
        return; // Stop initialization if user is banned
    }
    
    // Initialize session tracking for engagement
    initializeSession();
    
    // Add click effects to all buttons
    var buttons = document.querySelectorAll('button, .primary-btn, .game-card a');
    for (var i = 0; i < buttons.length; i++) {
        addButtonClickEffect(buttons[i]);
    }
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation to game cards
    var gameCards = document.querySelectorAll('.game-card');
    for (var i = 0; i < gameCards.length; i++) {
        gameCards[i].style.animation = 'slide-up 0.6s ease-out ' + (i * 0.1) + 's both';
    }
    
    // Enhance form inputs with focus effects
    var inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function() {
            this.style.boxShadow = '0 0 10px rgba(249, 217, 35, 0.3)';
            this.style.borderColor = '#f9d923';
        });
        
        inputs[i].addEventListener('blur', function() {
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
    }
});

// Session initialization for engagement tracking
function initializeSession() {
    try {
        // Update session start time and track total play time
        const session = getPlayerSession();
        const now = Date.now();
        
        // Update play time if returning user
        if (session.startTime && session.startTime < now) {
            const sessionDuration = now - session.startTime;
            updatePlayerSession({
                totalPlayTime: session.totalPlayTime + sessionDuration,
                startTime: now
            });
        }
        
        // Track daily play time
        const today = new Date().toDateString();
        if (!session.dailyPlayTime[today]) {
            session.dailyPlayTime[today] = 0;
        }
        
        // Set up periodic session updates
        setInterval(function() {
            updatePlayerSession({
                totalPlayTime: getPlayerSession().totalPlayTime + 30000, // 30 seconds
                lastActivity: Date.now()
            });
        }, 30000);
        
        // Show welcome back message for returning players
        if (session.gamesPlayed > 0 && session.engagementLevel !== 'new') {
            setTimeout(function() {
                showNotification(`🎉 Welcome back to Pyramid Casino!`, 'info', 3000);
            }, 1000);
        }
        
    } catch (e) {
        console.error('Error initializing session:', e);
    }
}

// Game instruction content for each game
const GAME_INSTRUCTIONS = {
    'Blackjack': `
        <h3>🃏 How to Play Blackjack</h3>
        <ul>
            <li><strong>Goal:</strong> Get cards totaling closer to 21 than the dealer without going over</li>
            <li><strong>Card Values:</strong>
                <ul>
                    <li>Number cards: Face value</li>
                    <li>Face cards (J, Q, K): 10 points</li>
                    <li>Aces: 1 or 11 (whichever is better)</li>
                </ul>
            </li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Place your bet and click "Deal"</li>
                    <li>You and dealer each get 2 cards (dealer shows 1)</li>
                    <li>Choose "Hit" to get another card or "Stand" to keep your total</li>
                    <li>If you go over 21, you "bust" and lose</li>
                    <li>Dealer draws cards until 17 or higher</li>
                    <li>Closest to 21 wins!</li>
                </ol>
            </li>
            <li><strong>Special Rules:</strong>
                <ul>
                    <li>Blackjack (21 with first 2 cards): Pays 3:2</li>
                    <li>Tie (Push): Get your bet back</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,
    
    'Slots': `
        <h3>🎰 How to Play Slots</h3>
        <ul>
            <li><strong>Goal:</strong> Match symbols across paylines to win chips</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Set your bet amount</li>
                    <li>Click "Spin" to spin the reels</li>
                    <li>Watch as symbols land on the reels</li>
                    <li>Win chips for matching symbol combinations</li>
                </ol>
            </li>
            <li><strong>Egyptian Symbols & Payouts:</strong>
                <ul>
                    <li>🔱 Pyramid: Highest payout</li>
                    <li>👁️ Eye of Horus: High payout</li>
                    <li>🐍 Snake: Medium payout</li>
                    <li>💎 Gems: Medium payout</li>
                    <li>🌟 Stars: Lower payout</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>More matching symbols = bigger wins</li>
                    <li>Try different bet amounts</li>
                    <li>Have fun with the ancient Egyptian theme!</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,
    
    'Roulette': `
        <h3>🎯 How to Play Roulette</h3>
        <ul>
            <li><strong>Goal:</strong> Predict where the ball will land on the spinning wheel</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Select chip value from the chip panel</li>
                    <li>Click on numbers or betting areas to place chips</li>
                    <li>Click "Spin" to start the wheel</li>
                    <li>Win if the ball lands on your bet!</li>
                </ol>
            </li>
            <li><strong>Bet Types & Payouts:</strong>
                <ul>
                    <li><strong>Single Number:</strong> 35:1 payout</li>
                    <li><strong>Red/Black:</strong> 1:1 payout</li>
                    <li><strong>Odd/Even:</strong> 1:1 payout</li>
                    <li><strong>1st/2nd/3rd 12:</strong> 2:1 payout</li>
                    <li><strong>1-18/19-36:</strong> 1:1 payout</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>Start with outside bets (red/black) for better odds</li>
                    <li>You can place multiple bets per spin</li>
                    <li>Use "Clear Bets" to remove all chips</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Poker': `
        <h3>🃏 How to Play Five-Card Draw Poker</h3>
        <ul>
            <li><strong>Goal:</strong> Make the best 5-card poker hand</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Place your ante bet</li>
                    <li>Receive 5 cards</li>
                    <li>Choose which cards to keep or discard</li>
                    <li>Draw new cards to replace discarded ones</li>
                    <li>Win based on your final hand strength</li>
                </ol>
            </li>
            <li><strong>Hand Rankings (High to Low):</strong>
                <ul>
                    <li><strong>Royal Flush:</strong> A, K, Q, J, 10 all same suit</li>
                    <li><strong>Straight Flush:</strong> 5 consecutive cards, same suit</li>
                    <li><strong>Four of a Kind:</strong> 4 cards of same rank</li>
                    <li><strong>Full House:</strong> 3 of a kind + pair</li>
                    <li><strong>Flush:</strong> 5 cards same suit</li>
                    <li><strong>Straight:</strong> 5 consecutive cards</li>
                    <li><strong>Three of a Kind:</strong> 3 cards same rank</li>
                    <li><strong>Two Pair:</strong> 2 pairs of different ranks</li>
                    <li><strong>One Pair:</strong> 2 cards same rank</li>
                    <li><strong>High Card:</strong> No matching cards</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Dice': `
        <h3>🎲 How to Play Dice</h3>
        <ul>
            <li><strong>Goal:</strong> Predict the outcome of rolling two dice</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Choose your bet type</li>
                    <li>Set your bet amount</li>
                    <li>Click "Roll Dice" to see the result</li>
                    <li>Win chips based on your prediction!</li>
                </ol>
            </li>
            <li><strong>Bet Types:</strong>
                <ul>
                    <li><strong>Specific Number (2-12):</strong> High payouts for exact totals</li>
                    <li><strong>High (8-12):</strong> Even money bet</li>
                    <li><strong>Low (2-6):</strong> Even money bet</li>
                    <li><strong>Even/Odd:</strong> Even money bet</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>7 is the most common dice total</li>
                    <li>2 and 12 are the rarest (highest payout)</li>
                    <li>High/Low bets have better odds than specific numbers</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Baccarat': `
        <h3>👑 How to Play Baccarat</h3>
        <ul>
            <li><strong>Goal:</strong> Bet on which hand (Player or Banker) will be closer to 9</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Choose to bet on Player, Banker, or Tie</li>
                    <li>Cards are dealt automatically</li>
                    <li>Hand closest to 9 wins</li>
                    <li>Third card rules are automatic</li>
                </ol>
            </li>
            <li><strong>Card Values:</strong>
                <ul>
                    <li>Aces: 1 point</li>
                    <li>2-9: Face value</li>
                    <li>10, J, Q, K: 0 points</li>
                    <li>If total > 9, only the last digit counts</li>
                </ul>
            </li>
            <li><strong>Payouts:</strong>
                <ul>
                    <li><strong>Player Wins:</strong> 1:1</li>
                    <li><strong>Banker Wins:</strong> 1:1 (5% commission)</li>
                    <li><strong>Tie:</strong> 8:1</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Keno': `
        <h3>🔢 How to Play Keno</h3>
        <ul>
            <li><strong>Goal:</strong> Pick numbers and hope they match the drawn numbers</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Choose 1-10 numbers from 1-80</li>
                    <li>Set your bet amount</li>
                    <li>Click "Draw Numbers"</li>
                    <li>20 random numbers are drawn</li>
                    <li>Win based on how many you matched!</li>
                </ol>
            </li>
            <li><strong>Payouts:</strong>
                <ul>
                    <li>More numbers picked = higher potential payouts</li>
                    <li>More matches = bigger wins</li>
                    <li>Exact payouts depend on how many numbers you chose</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>Picking 4-8 numbers often gives good balance of risk/reward</li>
                    <li>Each number has equal chance of being drawn</li>
                    <li>Try different strategies with number selection</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Coin Flip': `
        <h3>🪙 How to Play Coin Flip</h3>
        <ul>
            <li><strong>Goal:</strong> Predict whether the coin will land on heads or tails</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Set your bet amount</li>
                    <li>Choose "Heads" or "Tails"</li>
                    <li>Click "Flip Coin"</li>
                    <li>Watch the coin spin and land</li>
                    <li>Win double your bet if you guessed correctly!</li>
                </ol>
            </li>
            <li><strong>Odds:</strong>
                <ul>
                    <li>50/50 chance for heads or tails</li>
                    <li>Correct guess: Double your bet (1:1 payout)</li>
                    <li>Wrong guess: Lose your bet</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>Pure chance - no strategy needed!</li>
                    <li>Great for quick, simple bets</li>
                    <li>Trust your instincts or pick your lucky side</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Plinko': `
        <h3>🎯 How to Play Plinko</h3>
        <ul>
            <li><strong>Goal:</strong> Drop a ball through pegs to land in high-value prize slots</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Set your bet amount</li>
                    <li>Click "Drop Ball" or the drop zone</li>
                    <li>Watch the ball bounce through the pegs</li>
                    <li>Win chips based on which slot the ball lands in</li>
                </ol>
            </li>
            <li><strong>Prize Multipliers:</strong>
                <ul>
                    <li><strong>2.5x Jackpot:</strong> Center slot (highest payout)</li>
                    <li><strong>1.2x Good:</strong> Near center slots</li>
                    <li><strong>0.8x & 0.5x:</strong> Partial returns</li>
                    <li><strong>0.2x Small:</strong> Small consolation prize</li>
                    <li><strong>0x Loss:</strong> Lose your bet - try again!</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>The ball's path is random - pure chance!</li>
                    <li>Center slots have higher payouts but are harder to hit</li>
                    <li>Be careful of the 0x loss slots on the edges</li>
                    <li>Start with smaller bets to learn the game</li>
                    <li>Watch for the satisfying ball bounce animations</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,
    
    'Coin Pusher': `
        <h3>🪙 How to Play Coin Pusher</h3>
        <ul>
            <li><strong>Goal:</strong> Push coins over the edge to collect them and win prizes</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Set how many coins you want to drop (1-50)</li>
                    <li>Click "Drop Coins" to release them from the top</li>
                    <li>Watch as coins fall and push existing coins forward</li>
                    <li>Collect coins that fall into the collection zone</li>
                    <li>Find bonus prizes for extra multipliers!</li>
                </ol>
            </li>
            <li><strong>Winning & Payouts:</strong>
                <ul>
                    <li><strong>Collected Coins:</strong> 1 chip per coin collected</li>
                    <li><strong>Bonus Prizes:</strong> Special red tokens worth 5 chips each</li>
                    <li><strong>Pusher Action:</strong> Automatic pusher blade moves coins forward</li>
                    <li><strong>Physics:</strong> Realistic coin dropping and collision mechanics</li>
                </ul>
            </li>
            <li><strong>Strategy Tips:</strong>
                <ul>
                    <li>Drop coins when the platform is full for better pushes</li>
                    <li>Watch for bonus prizes near the edge</li>
                    <li>Be patient - coins build up over time</li>
                    <li>Use the automatic pusher to your advantage</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `
};

// Transaction System
var TRANSACTION_STORAGE_KEY = 'pyramidCasinoTransactions';
var DAILY_TOPUP_KEY = 'pyramidCasinoDailyTopups';
var MAX_DAILY_TOPUPS = 5;
var MAX_TOPUP_AMOUNT = 10000;

// Enhanced balance functions with encrypted storage
function getCasinoBalance() {
    var encryptedBalance = localStorage.getItem('pyramidCasinoBalance');
    var balance = 1000; // default
    
    if (encryptedBalance) {
        var decryptedBalance = decryptData(encryptedBalance);
        if (decryptedBalance && validateGameData(decryptedBalance, 'balance')) {
            balance = parseInt(decryptedBalance, 10);
            if (isNaN(balance)) balance = 1000;
        } else {
            // Data corrupted or tampered - reset to default without calling setCasinoBalance
            console.warn('Balance data corrupted or tampered with, resetting to default');
            localStorage.setItem('pyramidCasinoBalance', encryptData('1000'));
            balance = 1000;
        }
    } else {
        // First time - set default encrypted balance directly
        localStorage.setItem('pyramidCasinoBalance', encryptData('1000'));
        balance = 1000;
    }
    
    return balance;
}

function setCasinoBalance(newBalance, transactionType, amount, description) {
    if (typeof transactionType === 'undefined') transactionType = 'unknown';
    if (typeof amount === 'undefined') amount = 0;
    if (typeof description === 'undefined') description = '';
    
    // Get old balance without triggering recursion
    var oldBalance = 1000; // default
    var encryptedBalance = localStorage.getItem('pyramidCasinoBalance');
    if (encryptedBalance) {
        var decryptedBalance = decryptData(encryptedBalance);
        if (decryptedBalance && validateGameData(decryptedBalance, 'balance')) {
            var parsedBalance = parseInt(decryptedBalance, 10);
            if (!isNaN(parsedBalance)) {
                oldBalance = parsedBalance;
            }
        }
    }
    
    // Store balance encrypted
    localStorage.setItem('pyramidCasinoBalance', encryptData(newBalance.toString()));
    
    // Record transaction if there's a change
    if (oldBalance !== newBalance && transactionType !== 'unknown') {
        recordTransaction(transactionType, amount, oldBalance, newBalance, description);
    }
}

// Transaction recording system with encryption
function recordTransaction(type, amount, oldBalance, newBalance, description) {
    if (typeof description === 'undefined') description = '';
    
    var transactions = getTransactionHistory();
    var transaction = {
        id: Date.now() + Math.random(), // Unique ID
        timestamp: new Date().toISOString(),
        type: type, // 'win', 'loss', 'topup', 'reset'
        amount: amount,
        oldBalance: oldBalance,
        newBalance: newBalance,
        description: description
    };
    
    transactions.push(transaction);
    
    // Keep only last 1000 transactions to prevent storage bloat
    if (transactions.length > 1000) {
        transactions.splice(0, transactions.length - 1000);
    }
    
    // Store encrypted transactions
    localStorage.setItem(TRANSACTION_STORAGE_KEY, encryptData(JSON.stringify(transactions)));
}

function getTransactionHistory() {
    try {
        var encryptedTransactions = localStorage.getItem(TRANSACTION_STORAGE_KEY);
        if (encryptedTransactions) {
            var decryptedData = decryptData(encryptedTransactions);
            if (decryptedData && validateGameData(decryptedData, 'transactions')) {
                return JSON.parse(decryptedData);
            } else {
                console.warn('Transaction history corrupted, resetting');
                localStorage.removeItem(TRANSACTION_STORAGE_KEY);
                return [];
            }
        }
        return [];
    } catch (e) {
        console.error('Error loading transaction history:', e);
        return [];
    }
}

function clearTransactionHistory() {
    if (confirm('🗑️ Are you sure you want to clear ALL transaction history?\n\n⚠️ This action cannot be undone!')) {
        if (confirm('🚨 FINAL WARNING: This will permanently delete your entire transaction history!\n\nClick OK to proceed or Cancel to keep your history.')) {
            localStorage.removeItem(TRANSACTION_STORAGE_KEY);
            showNotification('🗑️ Transaction history cleared!', 'info');
            return true;
        }
    }
    return false;
}

// Daily top-up limit system with encryption
function getTodayTopupCount() {
    try {
        var today = new Date().toDateString();
        var encryptedData = localStorage.getItem(DAILY_TOPUP_KEY);
        var dailyData = {};
        
        if (encryptedData) {
            var decryptedData = decryptData(encryptedData);
            if (decryptedData && validateGameData(decryptedData, 'topups')) {
                dailyData = JSON.parse(decryptedData);
            } else {
                console.warn('Daily topup data corrupted, resetting');
                localStorage.removeItem(DAILY_TOPUP_KEY);
            }
        }
        
        return dailyData[today] || 0;
    } catch (e) {
        console.error('Error loading daily topup count:', e);
        return 0;
    }
}

function incrementTodayTopupCount() {
    try {
        var today = new Date().toDateString();
        var encryptedData = localStorage.getItem(DAILY_TOPUP_KEY);
        var dailyData = {};
        
        if (encryptedData) {
            var decryptedData = decryptData(encryptedData);
            if (decryptedData && validateGameData(decryptedData, 'topups')) {
                dailyData = JSON.parse(decryptedData);
            }
        }
        
        dailyData[today] = (dailyData[today] || 0) + 1;
        
        // Clean old data (keep only last 30 days)
        var thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        var dates = Object.keys(dailyData);
        for (var i = 0; i < dates.length; i++) {
            if (new Date(dates[i]) < thirtyDaysAgo) {
                delete dailyData[dates[i]];
            }
        }
        
        // Store encrypted daily data
        localStorage.setItem(DAILY_TOPUP_KEY, encryptData(JSON.stringify(dailyData)));
        return dailyData[today];
    } catch (e) {
        console.error('Error incrementing daily topup count:', e);
        return 1;
    }
}

function canTopUpToday() {
    return getTodayTopupCount() < MAX_DAILY_TOPUPS;
}

// Enhanced balance update with transaction recording and anti-cheat
function updateBalance(amount, type, description) {
    if (typeof description === 'undefined') description = '';
    
    // Check for admin mode or legitimate actions
    if (typeof isAdminMode !== 'undefined' && isAdminMode()) {
        // Admin mode bypasses anti-cheat checks
        var currentBalance = getCasinoBalance();
        var newBalance = Math.max(0, currentBalance + amount);
        setCasinoBalanceSecure(newBalance, type, Math.abs(amount), description);
    } else if (typeof isLegitimateAction !== 'undefined' && !isLegitimateAction('balance_change', {type: type, amount: amount})) {
        // Legitimate action check failed
        console.warn('Balance update blocked by anti-cheat system');
        return 0;
    } else {
        // Perform standard anti-cheat check for non-admin users
        if (!performAntiCheatCheck()) {
            return 0;
        }
        
        var currentBalance = getCasinoBalance();
        var newBalance = Math.max(0, currentBalance + amount);
        setCasinoBalanceSecure(newBalance, type, Math.abs(amount), description);
    }
    
    // Update UI if balance element exists
    var balanceEl = document.getElementById('balance');
    if (balanceEl) {
        if (typeof updateBalanceWithAnimation === 'function') {
            updateBalanceWithAnimation(balanceEl, newBalance);
        } else {
            balanceEl.textContent = newBalance;
        }
    }
    
    return newBalance;
}

// Game-specific transaction recording functions with anti-cheat and engagement tracking
function recordGameBet(gameName, betAmount) {
    // Perform anti-cheat check first
    if (!performAntiCheatCheck()) {
        return 0;
    }
    
    var currentBalance = getCasinoBalance();
    var newBalance = Math.max(0, currentBalance - betAmount);
    setCasinoBalanceSecure(newBalance, 'loss', -betAmount, gameName + ' bet: ' + betAmount + ' chips');
    
    // Update session tracking
    updatePlayerSession({
        gamesPlayed: getPlayerSession().gamesPlayed + 1,
        totalBets: getPlayerSession().totalBets + betAmount,
        lastActivity: Date.now()
    });
    
    // Update UI if balance element exists
    var balanceEl = document.getElementById('balance');
    if (balanceEl) {
        if (typeof updateBalanceWithAnimation === 'function') {
            updateBalanceWithAnimation(balanceEl, newBalance);
        } else {
            balanceEl.textContent = newBalance;
        }
    }
    
    return newBalance;
}

function recordGameWin(gameName, winAmount, details) {
    if (typeof details === 'undefined') details = '';
    
    // Perform anti-cheat check first
    if (!performAntiCheatCheck()) {
        return 0;
    }
    
    var currentBalance = getCasinoBalance();
    var newBalance = currentBalance + winAmount;
    var description = details ? gameName + ' win: ' + winAmount + ' chips (' + details + ')' : gameName + ' win: ' + winAmount + ' chips';
    setCasinoBalanceSecure(newBalance, 'win', winAmount, description);
    
    // Update session tracking
    updatePlayerSession({
        totalWins: getPlayerSession().totalWins + 1,
        consecutiveLosses: 0,
        lastActivity: Date.now()
    });
    
    // Update UI if balance element exists
    var balanceEl = document.getElementById('balance');
    if (balanceEl) {
        if (typeof updateBalanceWithAnimation === 'function') {
            updateBalanceWithAnimation(balanceEl, newBalance);
        } else {
            balanceEl.textContent = newBalance;
        }
    }
    
    return newBalance;
}

function recordGameLoss(gameName, details) {
    if (typeof details === 'undefined') details = '';
    
    // Update session tracking
    updatePlayerSession({
        consecutiveLosses: getPlayerSession().consecutiveLosses + 1,
        lastActivity: Date.now()
    });
    
    // Check if this should be a near-miss instead of regular loss
    const nearMissResult = generateSlotsNearMiss();
    if (nearMissResult.isNearMiss) {
        handleNearMiss(gameName, nearMissResult.type, nearMissResult.excitement);
    }
}

function recordGamePush(gameName, amount, details) {
    if (typeof details === 'undefined') details = '';
    
    // Perform anti-cheat check first
    if (!performAntiCheatCheck()) {
        return 0;
    }
    
    var currentBalance = getCasinoBalance();
    var newBalance = currentBalance + amount;
    var description = details ? gameName + ' push: ' + amount + ' chips returned (' + details + ')' : gameName + ' push: ' + amount + ' chips returned';
    setCasinoBalanceSecure(newBalance, 'win', amount, description);
    
    // Update session tracking
    updatePlayerSession({
        lastActivity: Date.now()
    });
    
    // Update UI if balance element exists
    var balanceEl = document.getElementById('balance');
    if (balanceEl) {
        if (typeof updateBalanceWithAnimation === 'function') {
            updateBalanceWithAnimation(balanceEl, newBalance);
        } else {
            balanceEl.textContent = newBalance;
        }
    }
    
    return newBalance;
}

// Top-up functionality with anti-cheat and admin overrides
function performTopUp(amount, showConfirmation) {
    if (typeof showConfirmation === 'undefined') showConfirmation = true;
    
    // Check for admin mode first
    if (typeof isAdminMode !== 'undefined' && isAdminMode()) {
        // Admin mode bypasses all restrictions
        var oldBalance = getCasinoBalance();
        var newBalance = updateBalance(amount, 'topup', 'Admin top-up of ' + amount + ' chips');
        showNotification('✨ Admin top-up of ' + amount + ' chips!\n💰 New Balance: ' + newBalance, 'win', 4000);
        return true;
    }
    
    // Check if topup is legitimate
    if (typeof isLegitimateAction !== 'undefined' && !isLegitimateAction('topup', {amount: amount})) {
        showNotification('❌ Top-up temporarily unavailable. Please try again later.', 'lose');
        return false;
    }
    
    // Perform standard anti-cheat check for non-admin users
    if (!performAntiCheatCheck()) {
        return false;
    }
    
    // Validation
    if (!amount || amount <= 0) {
        showNotification('❌ Please enter a valid amount!', 'lose');
        return false;
    }
    
    if (amount > MAX_TOPUP_AMOUNT) {
        showNotification('❌ Maximum top-up amount is ' + MAX_TOPUP_AMOUNT + ' chips!', 'lose');
        return false;
    }
    
    if (!canTopUpToday()) {
        var remaining = MAX_DAILY_TOPUPS - getTodayTopupCount();
        showNotification('❌ Daily top-up limit reached! (' + MAX_DAILY_TOPUPS + '/day)\nTry again tomorrow!', 'lose');
        return false;
    }
    
    // Confirmation popup
    if (showConfirmation) {
        var remainingTopups = MAX_DAILY_TOPUPS - getTodayTopupCount();
        if (!confirm('💰 Top up ' + amount + ' chips?\n\n📊 Current Balance: ' + getCasinoBalance() + '\n📈 New Balance: ' + (getCasinoBalance() + amount) + '\n\n🔄 Remaining top-ups today: ' + (remainingTopups - 1) + '/5\n\nProceed with top-up?')) {
            return false;
        }
    }
    
    // Perform top-up
    var oldBalance = getCasinoBalance();
    var newBalance = updateBalance(amount, 'topup', 'Top-up of ' + amount + ' chips');
    incrementTodayTopupCount();
    
    var remainingTopups = MAX_DAILY_TOPUPS - getTodayTopupCount();
    showNotification('✨ Successfully topped up ' + amount + ' chips!\n💰 New Balance: ' + newBalance + '\n🔄 Remaining top-ups today: ' + remainingTopups, 'win', 4000);
    
    return true;
}

// Utility functions for transaction display
function formatTransactionType(type) {
    var types = {
        'win': '🎉 Win',
        'loss': '💸 Loss', 
        'topup': '💰 Top-up',
        'reset': '🔄 Reset',
        'bonus': '🎁 Bonus'
    };
    return types[type] || type;
}

function formatCurrency(amount) {
    return amount.toLocaleString();
}

function formatDate(isoString) {
    var date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Confirmation dialog helper
function confirmAction(message, title) {
    if (typeof title === 'undefined') title = 'Confirm Action';
    return confirm(title + '\n\n' + message);
}

// Encrypted Data Security System
var BAN_STATUS_KEY = 'pyramidCasinoBanStatus';
var BAN_DURATION_HOURS = 48;
var ENCRYPTION_KEY = 'PyramidCasino2024Security'; // Simple key for client-side obfuscation

// Simple encryption for client-side data protection (obfuscation)
function encryptData(data) {
    var dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    var encrypted = '';
    var keyLength = ENCRYPTION_KEY.length;
    
    for (var i = 0; i < dataStr.length; i++) {
        var char = dataStr.charCodeAt(i);
        var keyChar = ENCRYPTION_KEY.charCodeAt(i % keyLength);
        encrypted += String.fromCharCode(char ^ keyChar);
    }
    
    // Base64 encode to make it look more obscure
    return btoa(encrypted);
}

// Simple decryption for client-side data protection
function decryptData(encryptedData) {
    if (!encryptedData) return null;
    
    try {
        // Base64 decode first
        var encrypted = atob(encryptedData);
        var decrypted = '';
        var keyLength = ENCRYPTION_KEY.length;
        
        for (var i = 0; i < encrypted.length; i++) {
            var char = encrypted.charCodeAt(i);
            var keyChar = ENCRYPTION_KEY.charCodeAt(i % keyLength);
            decrypted += String.fromCharCode(char ^ keyChar);
        }
        
        return decrypted;
    } catch (e) {
        console.warn('Data decryption failed, may be corrupted');
        return null;
    }
}

// Validate if data looks reasonable (basic anti-cheat without aggressive checking)
function validateGameData(data, dataType) {
    if (!data) return false;
    
    try {
        switch(dataType) {
            case 'balance':
                // Check if it's a valid number string
                if (!/^\d+$/.test(data)) return false;
                var balance = parseInt(data);
                // Reasonable balance check - no more than 10 million chips
                return !isNaN(balance) && balance >= 0 && balance <= 10000000;
                
            case 'transactions':
                var transactions = JSON.parse(data);
                return Array.isArray(transactions) && transactions.length <= 1000;
                
            case 'topups':
                var topups = JSON.parse(data);
                return typeof topups === 'object' && topups !== null;
                
            default:
                return true;
        }
    } catch (e) {
        return false;
    }
}

// Ban management functions
function getBanStatus() {
    try {
        var banData = localStorage.getItem(BAN_STATUS_KEY);
        if (!banData) return null;
        
        var ban = JSON.parse(banData);
        var now = Date.now();
        
        // Check if ban has expired
        if (now > ban.expiresAt) {
            localStorage.removeItem(BAN_STATUS_KEY);
            return null;
        }
        
        return ban;
    } catch (e) {
        console.error('Error loading ban status:', e);
        return null;
    }
}

function setBanStatus(reason) {
    var now = Date.now();
    var expiresAt = now + (BAN_DURATION_HOURS * 60 * 60 * 1000);
    
    var banData = {
        bannedAt: now,
        expiresAt: expiresAt,
        reason: reason || 'Attempting to manipulate casino data',
        duration: BAN_DURATION_HOURS
    };
    
    localStorage.setItem(BAN_STATUS_KEY, JSON.stringify(banData));
    return banData;
}

function clearBan() {
    localStorage.removeItem(BAN_STATUS_KEY);
}

// Check for obvious cheating attempts and handle ban
function handleCheatDetection(reason) {
    // Set balance to zero (encrypted)
    localStorage.setItem('pyramidCasinoBalance', encryptData('0'));
    
    // Clear sensitive data
    localStorage.removeItem(TRANSACTION_STORAGE_KEY);
    localStorage.removeItem(DAILY_TOPUP_KEY);
    
    // Set ban status
    setBanStatus(reason);
    
    // Show ban screen
    showBanScreen();
}

// Show ban screen with countdown
function showBanScreen() {
    var banStatus = getBanStatus();
    if (!banStatus) return;
    
    // Create ban screen overlay
    var banScreen = document.createElement('div');
    banScreen.id = 'ban-screen';
    banScreen.innerHTML = `
        <div class="ban-overlay">
            <div class="ban-modal">
                <div class="ban-header">
                    <h1>🚫 Account Temporarily Banned</h1>
                </div>
                <div class="ban-content">
                    <div class="ban-icon">⚠️</div>
                    <h2>Anti-Cheat System Triggered</h2>
                    <p><strong>Reason:</strong> ${banStatus.reason}</p>
                    <p>Your account has been temporarily suspended for attempting to manipulate casino data.</p>
                    
                    <div class="ban-details">
                        <h3>What happened?</h3>
                        <ul>
                            <li>Our system detected unauthorized changes to your chip balance, transaction history, or daily topup data</li>
                            <li>Your chip balance has been reset to zero as a security measure</li>
                            <li>This ban will automatically expire in <strong id="countdown-timer">--:--:--</strong></li>
                        </ul>
                    </div>
                    
                    <div class="ban-actions">
                        <p><strong>When the ban expires:</strong></p>
                        <ul>
                            <li>You will receive 1000 starting chips</li>
                            <li>You can resume playing all casino games</li>
                            <li>Your daily topup allowance will be restored</li>
                        </ul>
                    </div>
                    
                    <div class="ban-timer">
                        <h3>Time Remaining:</h3>
                        <div class="countdown-display" id="countdown-display">
                            <div class="time-unit">
                                <span id="hours">00</span>
                                <label>Hours</label>
                            </div>
                            <div class="time-unit">
                                <span id="minutes">00</span>
                                <label>Minutes</label>
                            </div>
                            <div class="time-unit">
                                <span id="seconds">00</span>
                                <label>Seconds</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ban-footer">
                        <p><em>Please play fairly and enjoy the games responsibly!</em></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS styles
    var style = document.createElement('style');
    style.textContent = `
        #ban-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        
        .ban-modal {
            background: linear-gradient(135deg, #231b36 0%, #18122b 100%);
            border: 3px solid #d7263d;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(215, 38, 61, 0.3);
            animation: banModalSlide 0.5s ease-out;
        }
        
        @keyframes banModalSlide {
            from {
                transform: scale(0.7) translateY(-50px);
                opacity: 0;
            }
            to {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }
        
        .ban-header {
            background: #d7263d;
            color: white;
            padding: 1.5rem;
            text-align: center;
            border-radius: 17px 17px 0 0;
        }
        
        .ban-header h1 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: bold;
        }
        
        .ban-content {
            padding: 2rem;
            color: #f3e9dc;
            text-align: center;
        }
        
        .ban-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        
        .ban-content h2 {
            color: #d7263d;
            margin: 1rem 0;
            font-size: 1.5rem;
        }
        
        .ban-content h3 {
            color: #f9d923;
            margin: 1.5rem 0 1rem 0;
        }
        
        .ban-details, .ban-actions {
            background: rgba(249, 217, 35, 0.1);
            border: 1px solid #f9d923;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            text-align: left;
        }
        
        .ban-details ul, .ban-actions ul {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }
        
        .ban-details li, .ban-actions li {
            margin: 0.5rem 0;
            line-height: 1.4;
        }
        
        .countdown-display {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 1rem 0;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
        }
        
        .time-unit {
            text-align: center;
        }
        
        .time-unit span {
            display: block;
            font-size: 2.5rem;
            font-weight: bold;
            color: #d7263d;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 10px rgba(215, 38, 61, 0.5);
        }
        
        .time-unit label {
            color: #a0843a;
            font-size: 0.9rem;
            text-transform: uppercase;
            font-weight: bold;
        }
        
        .ban-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #a0843a;
            color: #a0843a;
            font-style: italic;
        }
        
        @media (max-width: 600px) {
            .ban-modal {
                margin: 1rem;
                width: calc(100% - 2rem);
            }
            
            .ban-content {
                padding: 1.5rem;
            }
            
            .countdown-display {
                gap: 1rem;
            }
            
            .time-unit span {
                font-size: 2rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banScreen);
    
    // Start countdown
    updateCountdown(banStatus.expiresAt);
    var countdownInterval = setInterval(function() {
        if (updateCountdown(banStatus.expiresAt)) {
            clearInterval(countdownInterval);
            // Ban expired, reload page
            window.location.reload();
        }
    }, 1000);
}

// Update countdown display
function updateCountdown(expiresAt) {
    var now = Date.now();
    var remaining = expiresAt - now;
    
    if (remaining <= 0) {
        // Ban expired
        clearBan();
        return true;
    }
    
    var hours = Math.floor(remaining / (1000 * 60 * 60));
    var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');
    
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    return false;
}

// Enhanced balance functions with encrypted storage
function getCasinoBalanceSecure() {
    // Check if user is banned
    var banStatus = getBanStatus();
    if (banStatus) {
        showBanScreen();
        return 0;
    }
    
    return getCasinoBalance();
}

function setCasinoBalanceSecure(newBalance, transactionType, amount, description) {
    // Check if user is banned
    var banStatus = getBanStatus();
    if (banStatus) {
        showBanScreen();
        return;
    }
    
    // Basic validation to prevent extreme values
    if (typeof newBalance === 'number' && newBalance > 10000000) {
        handleCheatDetection('Attempted to set unreasonably high balance: ' + newBalance);
        return;
    }
    
    // Set balance using encrypted storage
    setCasinoBalance(newBalance, transactionType, amount, description);
}

// Lightweight anti-cheat check (much less aggressive than before)
function performAntiCheatCheck() {
    // Admin mode bypasses all checks
    if (typeof isAdminMode !== 'undefined' && isAdminMode()) {
        return true;
    }
    
    // Check if user is banned
    var banStatus = getBanStatus();
    if (banStatus) {
        showBanScreen();
        return false;
    }
    
    // Only check for extreme values that indicate obvious tampering
    var currentBalance = getCasinoBalance();
    if (currentBalance > 10000000) {
        handleCheatDetection('Balance exceeds reasonable limits: ' + currentBalance);
        return false;
    }
    
    return true;
}

// Initialize lightweight anti-cheat system
function initializeAntiCheat() {
    // Check ban status first
    var banStatus = getBanStatus();
    if (banStatus) {
        showBanScreen();
        return false;
    }
    
    // Admin mode can bypass all checks
    if (typeof isAdminMode !== 'undefined' && isAdminMode()) {
        console.log('Admin mode active - anti-cheat checks minimal');
        return true;
    }
    
    // Only check for obvious tampering (no more periodic integrity checks)
    var currentBalance = getCasinoBalance();
    if (currentBalance > 10000000) {
        handleCheatDetection('Initial check: Balance exceeds reasonable limits');
        return false;
    }
    
    return true;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showInstructions,
        addCardFlipAnimation,
        addChipDropAnimation,
        updateBalanceWithAnimation,
        showNotification,
        addButtonClickEffect,
        GAME_INSTRUCTIONS,
        getCasinoBalance,
        setCasinoBalance,
        updateBalance,
        recordGameBet,
        recordGameWin,
        recordGamePush,
        performTopUp,
        getTransactionHistory,
        clearTransactionHistory,
        canTopUpToday,
        getTodayTopupCount,
        formatTransactionType,
        formatCurrency,
        formatDate,
        confirmAction,
        MAX_DAILY_TOPUPS,
        MAX_TOPUP_AMOUNT,
        // Anti-cheat functions
        performAntiCheatCheck,
        initializeAntiCheat,
        getCasinoBalanceSecure,
        setCasinoBalanceSecure,
        getBanStatus,
        showBanScreen
    };
}