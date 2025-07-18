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
    var closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() { modal.style.display = 'none'; };
    
    // Close when clicking outside the modal
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Close with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

function showInstructions(gameTitle, instructions) {
    var modal = createInstructionsModal(gameTitle, instructions);
    modal.style.display = 'block';
    
    // Force a reflow then start animation
    modal.offsetHeight;
    var modalContent = modal.querySelector('.modal-content');
    modalContent.style.opacity = '1';
    modalContent.style.transform = 'scale(1) translateY(0)';
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

// Enhanced notification system
function showNotification(message, type, duration) {
    if (typeof type === 'undefined') type = 'info';
    if (typeof duration === 'undefined') duration = 3000;
    
    // Remove existing notifications
    var existingNotifications = document.querySelectorAll('.game-notification');
    for (var i = 0; i < existingNotifications.length; i++) {
        existingNotifications[i].remove();
    }
    
    var notification = document.createElement('div');
    notification.className = 'game-notification notification-' + type;
    notification.innerHTML = message;
    
    var styles = {
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
    setTimeout(function() {
        notification.style.animation = 'slide-up 0.5s ease-out reverse';
        setTimeout(function() { 
            notification.remove(); 
        }, 500);
    }, duration);
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

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
                    <li><strong>5x Jackpot:</strong> Center slot (highest payout)</li>
                    <li><strong>2x Multiplier:</strong> Near center slots</li>
                    <li><strong>1x Even:</strong> Return your bet</li>
                    <li><strong>0.5x Small:</strong> Half your bet back</li>
                    <li><strong>0.1x Tiny:</strong> Small consolation prize</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>The ball's path is random - pure chance!</li>
                    <li>Center slots have higher payouts but are harder to hit</li>
                    <li>Start with smaller bets to learn the game</li>
                    <li>Watch for the satisfying ball bounce animations</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Solitaire': `
        <h3>♠️ How to Play Solitaire (Klondike)</h3>
        <ul>
            <li><strong>Goal:</strong> Move all cards to foundation piles, organized by suit from Ace to King</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Set your bet and click "New Game"</li>
                    <li>Build sequences in the tableau (King down to Ace, alternating colors)</li>
                    <li>Move Aces to foundation piles when available</li>
                    <li>Build foundation piles up by suit (A, 2, 3...K)</li>
                    <li>Flip face-down cards by uncovering them</li>
                </ol>
            </li>
            <li><strong>Scoring & Winning:</strong>
                <ul>
                    <li><strong>Complete Game:</strong> Win bet + time/move bonuses</li>
                    <li><strong>Time Bonus:</strong> Faster completion = higher multiplier</li>
                    <li><strong>Move Bonus:</strong> Fewer moves = higher multiplier</li>
                    <li><strong>Best Strategy:</strong> Complete quickly with minimal moves</li>
                </ul>
            </li>
            <li><strong>Tips:</strong>
                <ul>
                    <li>Always move Aces to foundations when possible</li>
                    <li>Uncover face-down cards as priority</li>
                    <li>Plan moves to create empty columns for Kings</li>
                    <li>Use the hint button if you get stuck</li>
                </ul>
            </li>
        </ul>
        <p><strong>💰 Remember: This is for fun only - no real money involved!</strong></p>
    `,

    'Go Fish': `
        <h3>🐟 How to Play Go Fish</h3>
        <ul>
            <li><strong>Goal:</strong> Collect the most "books" (sets of 4 cards of the same value)</li>
            <li><strong>How to Play:</strong>
                <ol>
                    <li>Set your bet and start a new game</li>
                    <li>You and the computer each get 7 cards</li>
                    <li>On your turn, ask the computer for cards of a specific value</li>
                    <li>If they have any, they give them to you and you continue</li>
                    <li>If not, they say "Go Fish!" and you draw from the deck</li>
                    <li>When you collect 4 of the same value, they become a "book"</li>
                </ol>
            </li>
            <li><strong>Winning & Payouts:</strong>
                <ul>
                    <li><strong>Most Books Wins:</strong> Get more books than computer</li>
                    <li><strong>Victory Bonus:</strong> Larger winning margin = higher payout</li>
                    <li><strong>Tie Game:</strong> Get your bet back</li>
                    <li><strong>Loss:</strong> Computer gets more books</li>
                </ul>
            </li>
            <li><strong>Strategy Tips:</strong>
                <ul>
                    <li>Remember what cards the computer asks for</li>
                    <li>Ask for values you have multiple of</li>
                    <li>Pay attention to what cards are played</li>
                    <li>Try to complete books quickly</li>
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

// Enhanced balance functions with transaction recording
function getCasinoBalance() {
    let bal = parseInt(localStorage.getItem('pyramidCasinoBalance'), 10);
    if (isNaN(bal)) bal = 1000;
    return bal;
}

function setCasinoBalance(newBalance, transactionType, amount, description) {
    if (typeof transactionType === 'undefined') transactionType = 'unknown';
    if (typeof amount === 'undefined') amount = 0;
    if (typeof description === 'undefined') description = '';
    
    var oldBalance = getCasinoBalance();
    localStorage.setItem('pyramidCasinoBalance', newBalance);
    
    // Record transaction if there's a change
    if (oldBalance !== newBalance && transactionType !== 'unknown') {
        recordTransaction(transactionType, amount, oldBalance, newBalance, description);
    }
}

// Transaction recording system
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
    
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
}

function getTransactionHistory() {
    try {
        const stored = localStorage.getItem(TRANSACTION_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
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

// Daily top-up limit system
function getTodayTopupCount() {
    try {
        var today = new Date().toDateString();
        var stored = localStorage.getItem(DAILY_TOPUP_KEY);
        var dailyData = stored ? JSON.parse(stored) : {};
        
        return dailyData[today] || 0;
    } catch (e) {
        console.error('Error loading daily topup count:', e);
        return 0;
    }
}

function incrementTodayTopupCount() {
    try {
        var today = new Date().toDateString();
        var stored = localStorage.getItem(DAILY_TOPUP_KEY);
        var dailyData = stored ? JSON.parse(stored) : {};
        
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
        
        localStorage.setItem(DAILY_TOPUP_KEY, JSON.stringify(dailyData));
        return dailyData[today];
    } catch (e) {
        console.error('Error incrementing daily topup count:', e);
        return 1;
    }
}

function canTopUpToday() {
    return getTodayTopupCount() < MAX_DAILY_TOPUPS;
}

// Enhanced balance update with transaction recording
function updateBalance(amount, type, description) {
    if (typeof description === 'undefined') description = '';
    
    var currentBalance = getCasinoBalance();
    var newBalance = Math.max(0, currentBalance + amount);
    setCasinoBalance(newBalance, type, Math.abs(amount), description);
    
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

// Game-specific transaction recording functions
function recordGameBet(gameName, betAmount) {
    var currentBalance = getCasinoBalance();
    var newBalance = Math.max(0, currentBalance - betAmount);
    setCasinoBalance(newBalance, 'loss', -betAmount, gameName + ' bet: ' + betAmount + ' chips');
    
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
    
    var currentBalance = getCasinoBalance();
    var newBalance = currentBalance + winAmount;
    var description = details ? gameName + ' win: ' + winAmount + ' chips (' + details + ')' : gameName + ' win: ' + winAmount + ' chips';
    setCasinoBalance(newBalance, 'win', winAmount, description);
    
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

function recordGamePush(gameName, amount, details) {
    if (typeof details === 'undefined') details = '';
    
    var currentBalance = getCasinoBalance();
    var newBalance = currentBalance + amount;
    var description = details ? gameName + ' push: ' + amount + ' chips returned (' + details + ')' : gameName + ' push: ' + amount + ' chips returned';
    setCasinoBalance(newBalance, 'win', amount, description);
    
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

// Top-up functionality
function performTopUp(amount, showConfirmation) {
    if (typeof showConfirmation === 'undefined') showConfirmation = true;
    
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
        MAX_TOPUP_AMOUNT
    };
}