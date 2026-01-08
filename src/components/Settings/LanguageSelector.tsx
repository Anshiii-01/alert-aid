/**
 * Language Selector Component
 * Dropdown to switch between supported languages
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Globe } from 'lucide-react';
import { productionColors } from '../../styles/production-ui-system';

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${productionColors.border.secondary};
  background: rgba(255, 255, 255, 0.05);
  color: ${productionColors.text.secondary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${productionColors.brand.primary};
    color: ${productionColors.brand.primary};
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  z-index: 1000;
  overflow: hidden;
`;

const LanguageOption = styled.button<{ $isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: none;
  background: ${props => props.$isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent'};
  color: ${props => props.$isActive ? productionColors.brand.primary : productionColors.text.primary};
  font-size: 14px;
  font-weight: ${props => props.$isActive ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${productionColors.border.secondary};
  }
`;

const LanguageName = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckMark = styled.span`
  color: ${productionColors.brand.primary};
  font-weight: 700;
`;

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-language-selector]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContainer data-language-selector>
      <LanguageButton onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <span>{currentLanguage.flag} {currentLanguage.name}</span>
      </LanguageButton>
      <Dropdown $isOpen={isOpen}>
        {languages.map(lang => (
          <LanguageOption
            key={lang.code}
            $isActive={i18n.language === lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <LanguageName>
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </LanguageName>
            {i18n.language === lang.code && <CheckMark>✓</CheckMark>}
          </LanguageOption>
        ))}
      </Dropdown>
    </DropdownContainer>
  );
};

export default LanguageSelector;
