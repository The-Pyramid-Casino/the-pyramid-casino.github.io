# Pyramid Casino - Admin Override System

This file contains documentation for the admin override system that prevents legitimate users from being banned by the anti-cheat system.

## Overview

The anti-cheat system has been enhanced with an admin override system that:
- Allows legitimate multiple topups without triggering bans
- Provides admin tools for managing users and casino state  
- Includes override codes for bypassing anti-cheat restrictions
- Maintains security while preventing false positives

## Admin Override Codes

The following override codes are available in `admin-config.js`:

- `PYRAMID_ADMIN_2024` - Master admin override code
- `BYPASS_CHECK_TEMP` - Temporary bypass for testing
- `DEV_DEBUG_MODE` - Developer debug mode

## Using Admin Mode

### Activate Admin Mode
```javascript
enableAdminMode("PYRAMID_ADMIN_2024")
```

### Check Admin Status
```javascript
adminStatus()
```

### Admin Commands
```javascript
// Unban a user
adminUnban("CONFIRM_UNBAN")

// Set user balance
adminSetBalance(5000, "CONFIRM_SET_BALANCE")

// Clear transaction history
adminClearTransactions("CONFIRM_CLEAR_TRANSACTIONS")

// Reset daily topup counters
adminResetTopups("CONFIRM_RESET_TOPUPS")

// Disable admin mode
disableAdminMode()
```

## Problem Fixed

**Issue**: Users were getting banned for legitimate topups when they topped up more than once.

**Solution**: 
1. Added intelligent topup detection that allows up to 10 legitimate topups before requiring admin review
2. Implemented grace periods for rapid balance changes
3. Added admin override system that bypasses all anti-cheat restrictions
4. Created whitelist patterns for legitimate user actions

## Configuration

The system can be configured via `ADMIN_CONFIG` in `admin-config.js`:

```javascript
ANTICHEAT_SETTINGS: {
    ENABLE_TOPUP_WHITELIST: true,        // Allow multiple legitimate topups
    SAFE_TOPUP_THRESHOLD: 10,           // Max safe topups before review
    BALANCE_CHANGE_GRACE_PERIOD: 60,    // Grace period in seconds
    DISABLE_INTEGRITY_CHECKS: false,    // Can disable for maintenance
    ADMIN_MODE_ENABLED: false           // Admin mode state
}
```

## How It Works

1. **Legitimate Action Detection**: The system now checks if actions are legitimate before applying anti-cheat restrictions
2. **Admin Overrides**: Admin mode bypasses all anti-cheat checks
3. **Smart Topup Handling**: Multiple topups are allowed if they're within reasonable limits
4. **Grace Periods**: Rapid actions have grace periods to prevent false positives

## Security Notes

- Override codes are stored in a separate file (`admin-config.js`)
- Admin mode is session-based and expires on page reload (unless reactivated)
- All admin actions are logged to the browser console
- The system maintains security while being more user-friendly

## For Regular Users

Regular users don't need to worry about these codes - the system now automatically handles legitimate actions without triggering bans. The anti-cheat system will only activate for actual cheating attempts.

If you're a legitimate user who got banned, you can contact an admin who can use the override codes to unban you.