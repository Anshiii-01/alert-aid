/**
 * ALERT NOTIFICATION SETTINGS COMPONENT
 * User preferences for sound and haptic feedback
 * Issue #15 Implementation
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Volume2, VolumeX, Smartphone, Bell, BellOff } from 'lucide-react';
import alertNotificationService, { AlertLevel } from '../../services/alertNotificationService';

const SettingsContainer = styled.div`
  background: rgba(22, 24, 29, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
`;

const SettingsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  
  svg {
    width: 18px;
    height: 18px;
    color: #6366f1;
  }
`;

const Toggle = styled.div<{ enabled: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background: ${({ enabled }) => (enabled ? '#22c55e' : 'rgba(255, 255, 255, 0.2)')};
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${({ enabled }) => (enabled ? '25px' : '3px')};
    transition: left 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const VolumeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #6366f1 0%, #6366f1 var(--value), rgba(255, 255, 255, 0.2) var(--value), rgba(255, 255, 255, 0.2) 100%);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const VolumeControl = styled.div`
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VolumeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const VolumeValue = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
`;

const TestButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const TestButton = styled.button<{ level: AlertLevel }>`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ level }) => {
    switch (level) {
      case 'CRITICAL':
        return `
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
          
          &:hover {
            background: rgba(239, 68, 68, 0.25);
          }
        `;
      case 'HIGH':
        return `
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: #f59e0b;
          
          &:hover {
            background: rgba(245, 158, 11, 0.25);
          }
        `;
      case 'MEDIUM':
        return `
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
          color: #3b82f6;
          
          &:hover {
            background: rgba(59, 130, 246, 0.25);
          }
        `;
      case 'LOW':
        return `
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.4);
          color: #22c55e;
          
          &:hover {
            background: rgba(34, 197, 94, 0.25);
          }
        `;
    }
  }}
`;

const PermissionButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SupportInfo = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`;

export const AlertNotificationSettings: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  useEffect(() => {
    // Load preferences
    const prefs = alertNotificationService.getPreferences();
    setSoundEnabled(prefs.soundEnabled);
    setHapticEnabled(prefs.hapticEnabled);
    setVolume(Math.round(prefs.volume * 100));
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  
  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    alertNotificationService.savePreferences({ soundEnabled: newValue });
  };
  
  const handleHapticToggle = () => {
    const newValue = !hapticEnabled;
    setHapticEnabled(newValue);
    alertNotificationService.savePreferences({ hapticEnabled: newValue });
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    alertNotificationService.savePreferences({ volume: newVolume / 100 });
  };
  
  const handleRequestPermission = async () => {
    const granted = await alertNotificationService.requestPermissions();
    if (granted) {
      setNotificationPermission('granted');
    }
  };
  
  const handleTestAlert = async (level: AlertLevel) => {
    await alertNotificationService.testAlert(level);
  };
  
  const isNotificationSupported = alertNotificationService.isNotificationSupported();
  const isVibrationSupported = alertNotificationService.isVibrationSupported();
  
  return (
    <SettingsContainer>
      <SettingsTitle>
        <Bell size={20} />
        Alert Notifications
      </SettingsTitle>
      
      <SettingRow>
        <SettingLabel>
          {soundEnabled ? <Volume2 /> : <VolumeX />}
          Sound Alerts
        </SettingLabel>
        <Toggle enabled={soundEnabled} onClick={handleSoundToggle} />
      </SettingRow>
      
      {soundEnabled && (
        <VolumeControl>
          <VolumeLabel>
            <span>Volume</span>
            <VolumeValue>{volume}%</VolumeValue>
          </VolumeLabel>
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            style={{ '--value': `${volume}%` } as React.CSSProperties}
          />
        </VolumeControl>
      )}
      
      <SettingRow>
        <SettingLabel>
          <Smartphone />
          Haptic Feedback (Vibration)
        </SettingLabel>
        <Toggle 
          enabled={hapticEnabled} 
          onClick={handleHapticToggle}
        />
      </SettingRow>
      
      {!isVibrationSupported && (
        <SupportInfo>
          ℹ️ Haptic feedback is not supported on this device
        </SupportInfo>
      )}
      
      {isNotificationSupported && notificationPermission !== 'granted' && (
        <PermissionButton onClick={handleRequestPermission}>
          <BellOff size={16} style={{ marginRight: '8px', display: 'inline' }} />
          Enable Browser Notifications
        </PermissionButton>
      )}
      
      {notificationPermission === 'granted' && (
        <SupportInfo>
          ✅ Browser notifications enabled
        </SupportInfo>
      )}
      
      <TestButtonsContainer>
        <TestButton level="CRITICAL" onClick={() => handleTestAlert('CRITICAL')}>
          Test Critical
        </TestButton>
        <TestButton level="HIGH" onClick={() => handleTestAlert('HIGH')}>
          Test High
        </TestButton>
        <TestButton level="MEDIUM" onClick={() => handleTestAlert('MEDIUM')}>
          Test Medium
        </TestButton>
        <TestButton level="LOW" onClick={() => handleTestAlert('LOW')}>
          Test Low
        </TestButton>
      </TestButtonsContainer>
    </SettingsContainer>
  );
};

export default AlertNotificationSettings;
