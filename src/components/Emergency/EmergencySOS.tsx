/**
 * EmergencySOS - One-Click Emergency Alert System
 * Enhanced with loading indicator for emergency actions (Issue #71)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { productionColors } from '../../styles/production-ui-system';
import alertNotificationService from '../../services/alertNotificationService';

/* ===================== TYPES ===================== */

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'family' | 'friend' | 'emergency' | 'medical';
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface EmergencySOSProps {
  onSOSActivated?: (data: SOSData) => void;
  emergencyContacts?: EmergencyContact[];
  userName?: string;
}

interface SOSData {
  timestamp: Date;
  location: LocationData | null;
  contacts: EmergencyContact[];
  status: 'pending' | 'sent' | 'failed';
  message: string;
}

/* ===================== ANIMATIONS ===================== */

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239,68,68,0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ===================== STYLES ===================== */

const Container = styled.div`
  background: linear-gradient(
    135deg,
    rgba(239,68,68,.1),
    ${productionColors.background.secondary}
  );
  border: 2px solid rgba(239,68,68,.3);
  border-radius: 20px;
  padding: 24px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: ${productionColors.brand.primary};
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  color: ${productionColors.text.secondary};
  font-size: 13px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`;

const SOSButton = styled.button`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(
    145deg,
    ${productionColors.brand.primary},
    #dc2626
  );
  color: #fff;
  font-size: 28px;
  font-weight: 800;
  cursor: pointer;
  animation: ${pulse} 2s infinite;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
  }
`;

const InstructionText = styled.p`
  text-align: center;
  font-size: 13px;
  margin-top: 12px;
  color: ${productionColors.text.secondary};
`;

const ErrorText = styled.p`
  text-align: center;
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} .8s linear infinite;
  margin: 0 auto;
`;

/* ===================== COMPONENT ===================== */

const EmergencySOS: React.FC<EmergencySOSProps> = ({
  onSOSActivated,
  emergencyContacts = [],
  userName = 'User',
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const defaultContacts = useMemo(
    () =>
      emergencyContacts.length
        ? emergencyContacts
        : [
            { id: '1', name: 'Emergency Services', phone: '911', type: 'emergency' },
            { id: '2', name: 'Family Contact', phone: '+1 555-0123', type: 'family' },
          ],
    [emergencyContacts]
  );

  /* ---------- Location ---------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      pos =>
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        }),
      err => console.error(err)
    );
  }, []);

  /* ---------- SOS ACTION ---------- */
  const handleSOSActivate = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await alertNotificationService.triggerAlert(
        'CRITICAL',
        'Emergency SOS Activated',
        `Emergency SOS triggered by ${userName}`
      );

      setSuccess(true);

      onSOSActivated?.({
        timestamp: new Date(),
        location,
        contacts: defaultContacts,
        status: 'sent',
        message: `Emergency SOS from ${userName}`,
      });
    } catch (e) {
      console.error(e);
      setError('Failed to send emergency alert. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, userName, location, defaultContacts, onSOSActivated]);

  /* ===================== UI ===================== */

  return (
    <Container>
      <Header>
        <Title>🆘 Emergency SOS</Title>
        <Subtitle>Press the button to trigger an emergency alert</Subtitle>
      </Header>

      <ButtonWrapper>
        <SOSButton onClick={handleSOSActivate} disabled={loading || success}>
          {loading ? <Spinner /> : 'SOS'}
        </SOSButton>
      </ButtonWrapper>

      <InstructionText>
        {loading && 'Processing emergency alert…'}
        {!loading && success && 'Emergency alert sent successfully!'}
        {!loading && !success && !error && 'Tap SOS to send an emergency alert'}
      </InstructionText>

      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default EmergencySOS;
