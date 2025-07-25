/**
 * Pyramid Casino - Centralized Theme Configuration
 * Apple Liquid Glass Design System
 */

// Theme configuration object
const PyramidTheme = {
  // Color palette for light and dark modes
  colors: {
    light: {
      // Background colors - Enhanced gradients for modern look
      primary: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 55%, #fbc2eb 100%)',
      secondary: 'rgba(255, 255, 255, 0.2)',
      surface: 'rgba(255, 255, 255, 0.15)',
      glass: 'rgba(255, 255, 255, 0.2)',
      
      // Text colors
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.9)',
        muted: 'rgba(255, 255, 255, 0.7)',
        inverse: '#1a1a1a'
      },
      
      // Border colors
      border: {
        primary: 'rgba(255, 255, 255, 0.2)',
        secondary: 'rgba(255, 255, 255, 0.15)',
        focus: '#667eea'
      },
      
      // Status colors
      success: '#22c55e',
      warning: '#fb923c',
      error: '#ef4444',
      info: '#3b82f6'
    },
    
    dark: {
      // Background colors - Enhanced dark gradients
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'rgba(0, 0, 0, 0.4)',
      surface: 'rgba(0, 0, 0, 0.3)',
      glass: 'rgba(0, 0, 0, 0.3)',
      
      // Text colors
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.9)',
        muted: 'rgba(255, 255, 255, 0.6)',
        inverse: '#ffffff'
      },
      
      // Border colors
      border: {
        primary: 'rgba(255, 255, 255, 0.1)',
        secondary: 'rgba(255, 255, 255, 0.08)',
        focus: '#667eea'
      },
      
      // Status colors
      success: '#16a34a',
      warning: '#ea580c',
      error: '#dc2626',
      info: '#2563eb'
    }
  },
  
  // Typography system
  typography: {
    fontFamily: {
      primary: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace"
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem'     // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  
  // Spacing system (rem units)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem'      // 96px
  },
  
  // Border radius system
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Shadow system for depth
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)'
  },
  
  // Blur effects for liquid glass
  blur: {
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '40px'
  },
  
  // Transition system
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  
  // Z-index system
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
};

// Theme state management
let currentTheme = 'light';

// Get current theme
function getCurrentTheme() {
  return currentTheme;
}

// Set theme
function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') {
    console.warn('Invalid theme:', theme, 'defaulting to light');
    theme = 'light';
  }
  
  currentTheme = theme;
  localStorage.setItem('pyramidCasinoTheme', theme);
  
  // Apply theme to document
  applyThemeToDocument(theme);
  
  // Dispatch theme change event
  window.dispatchEvent(new CustomEvent('themeChanged', { 
    detail: { theme: theme } 
  }));
}

// Apply theme styles to document
function applyThemeToDocument(theme) {
  const root = document.documentElement;
  const colors = PyramidTheme.colors[theme];
  
  // Apply CSS custom properties
  root.style.setProperty('--theme-bg-primary', colors.primary);
  root.style.setProperty('--theme-bg-secondary', colors.secondary);
  root.style.setProperty('--theme-bg-surface', colors.surface);
  root.style.setProperty('--theme-bg-glass', colors.glass);
  
  root.style.setProperty('--theme-text-primary', colors.text.primary);
  root.style.setProperty('--theme-text-secondary', colors.text.secondary);
  root.style.setProperty('--theme-text-muted', colors.text.muted);
  root.style.setProperty('--theme-text-inverse', colors.text.inverse);
  
  root.style.setProperty('--theme-border-primary', colors.border.primary);
  root.style.setProperty('--theme-border-secondary', colors.border.secondary);
  root.style.setProperty('--theme-border-focus', colors.border.focus);
  
  root.style.setProperty('--theme-success', colors.success);
  root.style.setProperty('--theme-warning', colors.warning);
  root.style.setProperty('--theme-error', colors.error);
  root.style.setProperty('--theme-info', colors.info);
  
  // Update body class for theme-specific styling
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
}

// Initialize theme system
function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('pyramidCasinoTheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('pyramidCasinoTheme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Toggle between light and dark themes
function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Get theme color
function getThemeColor(path) {
  const pathArray = path.split('.');
  let value = PyramidTheme.colors[currentTheme];
  
  for (const key of pathArray) {
    value = value[key];
    if (value === undefined) break;
  }
  
  return value;
}

// Get theme value (for spacing, typography, etc.)
function getThemeValue(category, key) {
  return PyramidTheme[category] && PyramidTheme[category][key];
}

// Export theme system for global use
if (typeof window !== 'undefined') {
  window.PyramidTheme = PyramidTheme;
  window.getCurrentTheme = getCurrentTheme;
  window.setTheme = setTheme;
  window.toggleTheme = toggleTheme;
  window.getThemeColor = getThemeColor;
  window.getThemeValue = getThemeValue;
  window.initializeTheme = initializeTheme;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
}