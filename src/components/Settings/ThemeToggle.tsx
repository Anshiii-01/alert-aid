/**
 * ThemeToggle - Interactive button to toggle between light and dark themes
 * Features smooth animations and accessibility support
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const ToggleButton = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 56px;
  height: 32px;
  border-radius: 16px;
  border: 2px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
    : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 2px;
  box-shadow: ${props => props.$isDark 
    ? '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
  };

  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
    box-shadow: ${props => props.$isDark 
      ? '0 6px 16px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
    };
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #EF4444;
    outline-offset: 2px;
  }
`;

const ToggleSlider = styled.div<{ $isDark: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #64748B 0%, #475569 100%)'
    : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
  };
  box-shadow: ${props => props.$isDark 
    ? '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(239, 68, 68, 0.2)'
    : '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 8px rgba(59, 130, 246, 0.15)'
  };
  transform: translateX(${props => props.$isDark ? '24px' : '0'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${props => props.$active ? rotate : 'none'} 0.5s ease-out;
  
  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.$active ? '#EF4444' : 'rgba(0, 0, 0, 0.4)'};
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span<{ $isDark: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#F8FAFC' : '#0F172A'};
  user-select: none;
  display: none;

  @media (min-width: 768px) {
    display: inline;
  }
`;

interface ThemeToggleProps {
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Container>
      {showLabel && <Label $isDark={isDark}>Theme</Label>}
      <ToggleButton
        $isDark={isDark}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <ToggleSlider $isDark={isDark}>
          <IconWrapper $active={isDark}>
            {isDark ? <Moon /> : <Sun />}
          </IconWrapper>
        </ToggleSlider>
      </ToggleButton>
    </Container>
  );
};

export default ThemeToggle;
