/**
 * Theme Configuration for styled-components
 * Light and dark theme color palettes with WCAG AA compliance
 */

export interface ThemeConfig {
  colors: {
    // Backgrounds
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
    };
    // Text
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    // Borders
    border: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    // Brand colors (consistent across themes)
    brand: {
      primary: string;
      secondary: string;
      accent: string;
    };
    // Status colors
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    // Risk levels
    risk: {
      critical: string;
      high: string;
      moderate: string;
      low: string;
    };
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    glow: string;
  };
}

export const lightTheme: ThemeConfig = {
  colors: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#94A3B8',
      inverse: '#FFFFFF',
    },
    border: {
      primary: '#E2E8F0',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
    },
    brand: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    risk: {
      critical: '#DC2626',
      high: '#EA580C',
      moderate: '#F59E0B',
      low: '#10B981',
    },
  },
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(239, 68, 68, 0.2)',
  },
};

export const darkTheme: ThemeConfig = {
  colors: {
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      elevated: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      inverse: '#0F172A',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.15)',
      tertiary: 'rgba(255, 255, 255, 0.2)',
    },
    brand: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
    },
    status: {
      success: '#22C55E',
      warning: '#FBBF24',
      error: '#EF4444',
      info: '#60A5FA',
    },
    risk: {
      critical: '#EF4444',
      high: '#F97316',
      moderate: '#FBBF24',
      low: '#22C55E',
    },
  },
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    medium: '0 4px 24px rgba(0, 0, 0, 0.3)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(239, 68, 68, 0.4)',
  },
};
