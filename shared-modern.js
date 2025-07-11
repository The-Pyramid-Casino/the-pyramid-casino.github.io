/* Shared Modern JavaScript for Pyramid Casino */

// Instructions modal functionality
function createInstructionsModal(gameTitle, instructions) {
    // Remove existing modal if any
    const existingModal = document.getElementById('instructions-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal HTML
    const modal = document.createElement('div');
    modal.id = 'instructions-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🎯 ${gameTitle} Instructions</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                ${instructions}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    
    // Close when clicking outside the modal
    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Close with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

function showInstructions(gameTitle, instructions) {
    const modal = createInstructionsModal(gameTitle, instructions);
    modal.style.display = 'block';
}

// Enhanced animations
function addCardFlipAnimation(cardElement) {
    cardElement.classList.add('new-card');
    setTimeout(() => {
        cardElement.classList.remove('new-card');
    }, 600);
}

function addChipDropAnimation(chipElement) {
    chipElement.classList.add('chip-drop');
    setTimeout(() => {
        chipElement.classList.remove('chip-drop');
    }, 800);
}

// Enhanced balance update with animation
function updateBalanceWithAnimation(balanceElement, newBalance) {
    const currentBalance = parseInt(balanceElement.textContent);
    const difference = newBalance - currentBalance;
    
    // Add visual feedback for wins/losses
    if (difference > 0) {
        balanceElement.style.color = '#43c734';
        balanceElement.style.textShadow = '0 0 10px rgba(67, 199, 52, 0.5)';
    } else if (difference < 0) {
        balanceElement.style.color = '#d7263d';
        balanceElement.style.textShadow = '0 0 10px rgba(215, 38, 61, 0.5)';
    }
    
    // Animate the number change
    const duration = 500;
    const steps = 20;
    const stepValue = difference / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const displayValue = Math.round(currentBalance + (stepValue * currentStep));
        balanceElement.textContent = displayValue;
        
        if (currentStep >= steps) {
            clearInterval(interval);
            balanceElement.textContent = newBalance;
            
            // Reset color after animation
            setTimeout(() => {
                balanceElement.style.color = '';
                balanceElement.style.textShadow = '';
            }, 1000);
        }
    }, duration / steps);
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.game-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `game-notification notification-${type}`;
    notification.innerHTML = message;
    
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        fontWeight: 'bold',
        fontSize: '1rem',
        zIndex: '9999',
        minWidth: '200px',
        textAlign: 'center',
        animation: 'slide-up 0.5s ease-out',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    };
    
    // Type-specific styling
    switch(type) {
        case 'win':
            styles.background = 'linear-gradient(135deg, #43c734, #2ea827)';
            styles.color = 'white';
            break;
        case 'lose':
            styles.background = 'linear-gradient(135deg, #d7263d, #b91c2e)';
            styles.color = 'white';
            break;
        case 'info':
            styles.background = 'linear-gradient(135deg, #f9d923, #eed920)';
            styles.color = '#18122b';
            break;
        default:
            styles.background = 'linear-gradient(135deg, #231b36, #18122b)';
            styles.color = '#f3e9dc';
            styles.border = '1px solid #f9d923';
    }
    
    Object.assign(notification.style, styles);
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.style.animation = 'slide-up 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

// Enhanced button click effects
function addButtonClickEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click effects to all buttons
    document.querySelectorAll('button, .primary-btn, .game-card a').forEach(addButtonClickEffect);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation to game cards
    document.querySelectorAll('.game-card').forEach((card, index) => {
        card.style.animation = `slide-up 0.6s ease-out ${index * 0.1}s both`;
    });
    
    // Enhance form inputs with focus effects
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 10px rgba(249, 217, 35, 0.3)';
            this.style.borderColor = '#f9d923';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
    });
});

// Game instruction content for each game
const GAME_INSTRUCTIONS = {
    'Blackjack Oasis': `
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
    
    'Pyramid Slots': `
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
    
    'Sphinx Roulette': `
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

    'Pharaoh\'s Poker': `
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

    'Anubis Dice': `
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

    'Cleopatra\'s Baccarat': `
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

    'Mummy\'s Keno': `
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

    'Pyramid Coin Flip': `
        <h3>🪙 How to Play Coin Flip</h3>
        <ul>
            <li><strong>Goal:</strong> Predict whether the ancient pyramid coin will land on heads or tails</li>
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
    `
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showInstructions,
        addCardFlipAnimation,
        addChipDropAnimation,
        updateBalanceWithAnimation,
        showNotification,
        addButtonClickEffect,
        GAME_INSTRUCTIONS
    };
}