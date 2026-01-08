/**
 * PWA Install Prompt Component
 * Prompts users to install the app as PWA
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Download, X } from 'lucide-react';
import { productionColors } from '../../styles/production-ui-system';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Banner = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: ${props => props.$visible ? '20px' : '-200px'};
  left: 50%;
  transform: translateX(-50%);
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: calc(100% - 40px);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 9999;
  transition: bottom 0.3s ease;

  @media (max-width: 768px) {
    bottom: ${props => props.$visible ? '10px' : '-200px'};
    width: calc(100% - 20px);
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${productionColors.brand.primary}, ${productionColors.brand.secondary});
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${productionColors.text.primary};
  margin-bottom: 4px;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${productionColors.text.secondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const InstallButton = styled.button`
  background: ${productionColors.brand.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${productionColors.brand.secondary};
    transform: translateY(-2px);
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${productionColors.text.tertiary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: ${productionColors.text.primary};
  }
`;

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user previously dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!deferredPrompt) return null;

  return (
    <Banner $visible={showBanner}>
      <IconWrapper>
        <Download size={24} color="white" />
      </IconWrapper>
      <Content>
        <Title>Install Alert Aid</Title>
        <Description>Get instant alerts even when offline</Description>
      </Content>
      <Actions>
        <InstallButton onClick={handleInstall}>
          Install
        </InstallButton>
        <CloseButton onClick={handleDismiss}>
          <X size={20} />
        </CloseButton>
      </Actions>
    </Banner>
  );
};

export default PWAInstallPrompt;
