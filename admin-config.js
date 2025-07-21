/* Pyramid Casino - Admin Configuration & Override System */

// Admin Override Codes - Keep these secure!
var ADMIN_CONFIG = {
    // Master override code to bypass anti-cheat system
    MASTER_OVERRIDE_CODE: 'PYRAMID_ADMIN_2024',
    
    // Temporary bypass code for testing
    TEMP_BYPASS_CODE: 'BYPASS_CHECK_TEMP',
    
    // Developer debug code
    DEBUG_MODE_CODE: 'DEV_DEBUG_MODE',
    
    // Anti-cheat system settings
    ANTICHEAT_SETTINGS: {
        // Allow multiple legitimate topups without triggering bans
        ENABLE_TOPUP_WHITELIST: true,
        
        // Maximum topups allowed before requiring admin review
        SAFE_TOPUP_THRESHOLD: 10,
        
        // Grace period for rapid balance changes (in seconds)
        BALANCE_CHANGE_GRACE_PERIOD: 60,
        
        // Disable integrity checks temporarily for maintenance
        DISABLE_INTEGRITY_CHECKS: false,
        
        // Enable admin mode bypass
        ADMIN_MODE_ENABLED: false
    },
    
    // Legitimate action patterns that should not trigger bans
    WHITELIST_PATTERNS: {
        // Allow rapid topups if amount is reasonable
        LEGITIMATE_TOPUP_SEQUENCE: true,
        
        // Allow balance restoration after legitimate wins
        LEGITIMATE_WIN_RESTORATION: true,
        
        // Allow admin balance adjustments
        ADMIN_BALANCE_ADJUSTMENT: true
    }
};

// Admin Override Functions
function checkAdminOverride(code) {
    if (!code) return false;
    
    var validCodes = [
        ADMIN_CONFIG.MASTER_OVERRIDE_CODE,
        ADMIN_CONFIG.TEMP_BYPASS_CODE,
        ADMIN_CONFIG.DEBUG_MODE_CODE
    ];
    
    return validCodes.includes(code.toUpperCase());
}

function enableAdminMode(overrideCode) {
    if (!checkAdminOverride(overrideCode)) {
        console.warn('Invalid admin override code provided');
        return false;
    }
    
    // Set admin mode in session
    sessionStorage.setItem('pyramidCasinoAdminMode', 'true');
    sessionStorage.setItem('pyramidCasinoAdminCode', overrideCode);
    
    // Log admin mode activation
    console.log('Admin mode activated with code:', overrideCode);
    
    // Show admin mode indicator
    showAdminModeIndicator();
    
    return true;
}

function isAdminMode() {
    var adminMode = sessionStorage.getItem('pyramidCasinoAdminMode');
    var adminCode = sessionStorage.getItem('pyramidCasinoAdminCode');
    
    return adminMode === 'true' && checkAdminOverride(adminCode);
}

function disableAdminMode() {
    sessionStorage.removeItem('pyramidCasinoAdminMode');
    sessionStorage.removeItem('pyramidCasinoAdminCode');
    hideAdminModeIndicator();
    console.log('Admin mode deactivated');
}

function showAdminModeIndicator() {
    // Remove existing indicator
    var existing = document.getElementById('admin-mode-indicator');
    if (existing) existing.remove();
    
    // Create admin mode indicator
    var indicator = document.createElement('div');
    indicator.id = 'admin-mode-indicator';
    indicator.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            left: 10px;
            background: linear-gradient(45deg, #d7263d, #ff6b7a);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(215, 38, 61, 0.3);
            animation: pulse 2s infinite;
            cursor: pointer;
        ">
            🛡️ ADMIN MODE
        </div>
    `;
    
    // Add click to disable
    indicator.onclick = function() {
        if (confirm('Disable admin mode?')) {
            disableAdminMode();
        }
    };
    
    // Add pulsing animation CSS if not exists
    if (!document.querySelector('#admin-pulse-style')) {
        var style = document.createElement('style');
        style.id = 'admin-pulse-style';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(indicator);
}

function hideAdminModeIndicator() {
    var indicator = document.getElementById('admin-mode-indicator');
    if (indicator) indicator.remove();
}

// Enhanced Anti-Cheat System with Admin Overrides
function isLegitimateAction(actionType, data) {
    // Admin mode bypasses all checks
    if (isAdminMode()) {
        console.log('Admin mode: Allowing action -', actionType);
        return true;
    }
    
    // Check if action is whitelisted
    switch (actionType) {
        case 'topup':
            return isLegitimateTopup(data);
        case 'balance_change':
            return isLegitimateBalanceChange(data);
        case 'transaction':
            return isLegitimateTransaction(data);
        default:
            return true; // Allow unknown actions by default
    }
}

function isLegitimateTopup(data) {
    if (!ADMIN_CONFIG.ANTICHEAT_SETTINGS.ENABLE_TOPUP_WHITELIST) {
        return true; // Whitelist disabled, allow all topups
    }
    
    var todayTopups = getTodayTopupCount();
    var safeThreshold = ADMIN_CONFIG.ANTICHEAT_SETTINGS.SAFE_TOPUP_THRESHOLD;
    
    // Allow topups under safe threshold
    if (todayTopups < safeThreshold) {
        return true;
    }
    
    // Allow reasonable topup amounts even above threshold
    var amount = data ? data.amount : 0;
    if (amount <= MAX_TOPUP_AMOUNT && todayTopups < (safeThreshold * 2)) {
        return true;
    }
    
    return false;
}

function isLegitimateBalanceChange(data) {
    // Allow all balance changes in admin mode
    if (isAdminMode()) return true;
    
    // Allow changes within grace period
    var lastChange = sessionStorage.getItem('lastBalanceChange');
    var now = Date.now();
    var gracePeriod = ADMIN_CONFIG.ANTICHEAT_SETTINGS.BALANCE_CHANGE_GRACE_PERIOD * 1000;
    
    if (lastChange && (now - parseInt(lastChange)) < gracePeriod) {
        return true;
    }
    
    // Update last change timestamp
    sessionStorage.setItem('lastBalanceChange', now.toString());
    
    return true;
}

function isLegitimateTransaction(data) {
    // Allow all transactions in admin mode
    if (isAdminMode()) return true;
    
    // Check for legitimate transaction patterns
    var transactionType = data ? data.type : '';
    var legitimateTypes = ['win', 'loss', 'topup', 'bonus'];
    
    return legitimateTypes.includes(transactionType);
}

// Admin Console Functions
function adminUnban(confirmation) {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    if (confirmation !== 'CONFIRM_UNBAN') {
        console.log('To unban, call: adminUnban("CONFIRM_UNBAN")');
        return false;
    }
    
    clearBan();
    setCasinoBalanceSecure(1000, 'admin', 1000, 'Admin unban - balance restored'); // Use encrypted storage
    
    console.log('User unbanned and balance restored to 1000 chips');
    return true;
}

function adminSetBalance(amount, confirmation) {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    if (confirmation !== 'CONFIRM_SET_BALANCE') {
        console.log('To set balance, call: adminSetBalance(amount, "CONFIRM_SET_BALANCE")');
        return false;
    }
    
    if (typeof amount !== 'number' || amount < 0) {
        console.error('Invalid amount. Must be a positive number.');
        return false;
    }
    
    setCasinoBalanceSecure(amount, 'admin', amount, 'Admin balance adjustment');
    console.log('Balance set to:', amount, 'chips');
    return true;
}

function adminClearTransactions(confirmation) {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    if (confirmation !== 'CONFIRM_CLEAR_TRANSACTIONS') {
        console.log('To clear transactions, call: adminClearTransactions("CONFIRM_CLEAR_TRANSACTIONS")');
        return false;
    }
    
    localStorage.removeItem(TRANSACTION_STORAGE_KEY);
    console.log('All transactions cleared');
    return true;
}

function adminResetTopups(confirmation) {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    if (confirmation !== 'CONFIRM_RESET_TOPUPS') {
        console.log('To reset topups, call: adminResetTopups("CONFIRM_RESET_TOPUPS")');
        return false;
    }
    
    localStorage.removeItem(DAILY_TOPUP_KEY);
    console.log('Daily topup counters reset');
    return true;
}

function adminStatus() {
    console.log('=== PYRAMID CASINO ADMIN STATUS ===');
    console.log('Admin Mode:', isAdminMode());
    console.log('Current Balance:', getCasinoBalance());
    console.log('Today\'s Topups:', getTodayTopupCount(), '/', MAX_DAILY_TOPUPS);
    console.log('Ban Status:', getBanStatus() ? 'BANNED (24hr duration)' : 'Active');
    console.log('Data Security: Enhanced encryption system active');
    console.log('Game Odds (House Edge %):');
    var gameSettings = getAdminGameSettings();
    for (var game in GAME_ODDS_CONFIG) {
        var currentEdge = gameSettings[game] || GAME_ODDS_CONFIG[game];
        console.log('  - ' + game + ': ' + currentEdge + '%');
    }
    console.log('Available Commands:');
    console.log('  - adminUnban("CONFIRM_UNBAN")');
    console.log('  - adminSetBalance(amount, "CONFIRM_SET_BALANCE")');
    console.log('  - adminClearTransactions("CONFIRM_CLEAR_TRANSACTIONS")');
    console.log('  - adminResetTopups("CONFIRM_RESET_TOPUPS")');
    console.log('  - adminSetGameOdds(gameName, houseEdgePercent)');
    console.log('  - adminViewGameOdds()');
    console.log('  - adminResetGameOdds("CONFIRM_RESET_ODDS")');
    console.log('  - enableAdminMode("OVERRIDE_CODE")');
    console.log('  - disableAdminMode()');
}

function adminSetGameOdds(gameName, houseEdgePercent) {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    var validGames = ['blackjack', 'slots', 'roulette', 'poker', 'dice', 'baccarat', 'keno', 'coinflip', 'plinko', 'coinpusher'];
    if (!validGames.includes(gameName)) {
        console.error('Invalid game name. Valid games:', validGames.join(', '));
        return false;
    }
    
    if (typeof houseEdgePercent !== 'number' || houseEdgePercent < 0 || houseEdgePercent > 50) {
        console.error('Invalid house edge. Must be between 0 and 50 percent.');
        return false;
    }
    
    return setAdminGameOdds(gameName, houseEdgePercent);
}

function adminViewGameOdds() {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    console.log('=== CURRENT GAME ODDS (House Edge %) ===');
    var gameSettings = getAdminGameSettings();
    for (var game in GAME_ODDS_CONFIG) {
        var currentEdge = gameSettings[game] || GAME_ODDS_CONFIG[game];
        var isCustom = gameSettings[game] ? ' (CUSTOM)' : ' (default)';
        console.log(game + ': ' + currentEdge + '%' + isCustom);
    }
    return true;
}

function adminResetGameOdds(confirmation) {
    if (!isAdminMode()) {
        console.error('Admin mode required for this action');
        return false;
    }
    
    if (confirmation !== 'CONFIRM_RESET_ODDS') {
        console.log('To reset all game odds to defaults, call: adminResetGameOdds("CONFIRM_RESET_ODDS")');
        return false;
    }
    
    localStorage.removeItem('pyramidCasinoAdminGameSettings');
    console.log('All game odds reset to default values');
    return true;
}

// Enhanced Console Access
function pyramidConsole() {
    console.log('%c🏛️ PYRAMID CASINO ADMIN CONSOLE', 'color: #f9d923; font-size: 16px; font-weight: bold;');
    console.log('%cTo enable admin mode, use: enableAdminMode("OVERRIDE_CODE")', 'color: #43c734;');
    console.log('%cFor admin status, use: adminStatus()', 'color: #43c734;');
    console.log('%cAvailable override codes can be found in admin-config.js', 'color: #a0843a;');
}

// Auto-show console info on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        if (isAdminMode()) {
            showAdminModeIndicator();
        }
        
        // Show console help in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            pyramidConsole();
        }
    });
    
    // Expose admin functions to global scope
    window.enableAdminMode = enableAdminMode;
    window.disableAdminMode = disableAdminMode;
    window.isAdminMode = isAdminMode;
    window.adminUnban = adminUnban;
    window.adminSetBalance = adminSetBalance;
    window.adminClearTransactions = adminClearTransactions;
    window.adminResetTopups = adminResetTopups;
    window.adminStatus = adminStatus;
    window.pyramidConsole = pyramidConsole;
    // New game odds admin functions
    window.adminSetGameOdds = adminSetGameOdds;
    window.adminViewGameOdds = adminViewGameOdds;
    window.adminResetGameOdds = adminResetGameOdds;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ADMIN_CONFIG,
        enableAdminMode,
        disableAdminMode,
        isAdminMode,
        checkAdminOverride,
        isLegitimateAction,
        adminUnban,
        adminSetBalance,
        adminClearTransactions,
        adminResetTopups,
        adminStatus,
        pyramidConsole,
        // New game odds functions
        adminSetGameOdds,
        adminViewGameOdds,
        adminResetGameOdds
    };
}