/**
 * AI Severity Prediction Card Component
 * Displays ML-powered disaster severity predictions
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Brain, AlertTriangle, TrendingUp, Users, DollarSign, Shield, RefreshCw } from 'lucide-react';
import { aiPredictionService, DisasterFeatures, SeverityPrediction } from '../../services/aiPredictionService';
import { productionColors } from '../../styles/production-ui-system';

interface Props {
  features?: DisasterFeatures;
  autoPredict?: boolean;
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Container = styled.div`
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: ${productionColors.text.primary};
`;

const AIBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${productionColors.border.secondary};
  border-radius: 8px;
  color: ${productionColors.text.secondary};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${productionColors.text.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SeverityDisplay = styled.div<{ $severity: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  background: ${props => {
    switch (props.$severity) {
      case 'catastrophic': return 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.3))';
      case 'critical': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))';
      case 'high': return 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.3))';
      case 'moderate': return 'linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(202, 138, 4, 0.3))';
      default: return 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$severity) {
      case 'catastrophic': return 'rgba(220, 38, 38, 0.5)';
      case 'critical': return 'rgba(239, 68, 68, 0.5)';
      case 'high': return 'rgba(249, 115, 22, 0.5)';
      case 'moderate': return 'rgba(234, 179, 8, 0.5)';
      default: return 'rgba(34, 197, 94, 0.5)';
    }
  }};
`;

const SeverityText = styled.div`
  text-align: center;
`;

const SeverityLevel = styled.div<{ $severity: string }>`
  font-size: 32px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${props => {
    switch (props.$severity) {
      case 'catastrophic': return '#DC2626';
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'moderate': return '#EAB308';
      default: return '#22C55E';
    }
  }};
  animation: ${props => (props.$severity === 'critical' || props.$severity === 'catastrophic') ? pulse : 'none'} 1.5s ease-in-out infinite;
`;

const Confidence = styled.div`
  font-size: 14px;
  color: ${productionColors.text.tertiary};
  margin-top: 8px;
`;

const PredictionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PredictionCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${productionColors.border.secondary};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const PredictionIcon = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${productionColors.text.secondary};
`;

const PredictionLabel = styled.div`
  font-size: 12px;
  color: ${productionColors.text.tertiary};
  margin-bottom: 4px;
`;

const PredictionValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${productionColors.text.primary};
`;

const PredictionRange = styled.span`
  font-size: 12px;
  color: ${productionColors.text.tertiary};
  font-weight: 400;
`;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${productionColors.text.secondary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RiskFactorsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RiskFactor = styled.li`
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #EF4444;
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${productionColors.text.secondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Recommendation = styled.li`
  padding: 10px 12px;
  background: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22C55E;
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${productionColors.text.secondary};
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModelInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid ${productionColors.border.secondary};
  font-size: 12px;
  color: ${productionColors.text.tertiary};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${productionColors.text.secondary};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.2);
  border-top-color: #8B5CF6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const SeverityPredictionCard: React.FC<Props> = ({
  features,
  autoPredict = true
}) => {
  const [prediction, setPrediction] = useState<SeverityPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFeatures: DisasterFeatures = useMemo(() => ({
    disasterType: 'flood',
    rainfall: 250,
    waterLevel: 3.5,
    populationDensity: 8500,
    infrastructureScore: 65,
    historicalImpact: 72,
    timeOfYear: new Date().getMonth() + 1,
    timeOfDay: new Date().getHours(),
  }), []);

  const runPrediction = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiPredictionService.predictSeverity(features || defaultFeatures);
      setPrediction(result);
    } catch (err) {
      setError('Failed to generate prediction');
      console.error('[AI Prediction Error]', err);
    } finally {
      setIsLoading(false);
    }
  }, [features, defaultFeatures]);

  useEffect(() => {
    if (autoPredict) {
      runPrediction();
    }
  }, [features, autoPredict, runPrediction]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <LoadingSpinner />
          <div>AI Model Processing...</div>
        </LoadingState>
      </Container>
    );
  }

  if (error || !prediction) {
    return (
      <Container>
        <Header>
          <Title>
            <Brain size={24} />
            AI Severity Prediction
            <AIBadge><Brain size={12} /> AI Powered</AIBadge>
          </Title>
        </Header>
        <LoadingState>
          <AlertTriangle size={40} style={{ marginBottom: 16, color: '#EF4444' }} />
          <div>{error || 'No prediction available'}</div>
          <RefreshButton onClick={runPrediction} style={{ marginTop: 16 }}>
            <RefreshCw size={16} />
            Retry Prediction
          </RefreshButton>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Brain size={24} />
          AI Severity Prediction
          <AIBadge><Brain size={12} /> AI Powered</AIBadge>
        </Title>
        <RefreshButton onClick={runPrediction} disabled={isLoading}>
          <RefreshCw size={16} />
          Refresh
        </RefreshButton>
      </Header>

      <SeverityDisplay $severity={prediction.severity}>
        <SeverityText>
          <SeverityLevel $severity={prediction.severity}>
            {prediction.severity}
          </SeverityLevel>
          <Confidence>
            Confidence: {Math.round(prediction.confidence * 100)}%
          </Confidence>
        </SeverityText>
      </SeverityDisplay>

      <PredictionsGrid>
        <PredictionCard>
          <PredictionIcon><Users size={20} /></PredictionIcon>
          <PredictionLabel>Predicted Casualties</PredictionLabel>
          <PredictionValue>
            {formatNumber(prediction.predictedCasualties.min)} - {formatNumber(prediction.predictedCasualties.max)}
          </PredictionValue>
        </PredictionCard>
        <PredictionCard>
          <PredictionIcon><TrendingUp size={20} /></PredictionIcon>
          <PredictionLabel>Displacement</PredictionLabel>
          <PredictionValue>
            {formatNumber(prediction.predictedDisplacement.min)} - {formatNumber(prediction.predictedDisplacement.max)}
          </PredictionValue>
        </PredictionCard>
        <PredictionCard>
          <PredictionIcon><DollarSign size={20} /></PredictionIcon>
          <PredictionLabel>Economic Loss (USD)</PredictionLabel>
          <PredictionValue>
            ${formatNumber(prediction.predictedEconomicLoss.min * 1000000)}
            <PredictionRange> - ${formatNumber(prediction.predictedEconomicLoss.max * 1000000)}</PredictionRange>
          </PredictionValue>
        </PredictionCard>
      </PredictionsGrid>

      <Section>
        <SectionTitle>
          <AlertTriangle size={16} />
          Risk Factors
        </SectionTitle>
        <RiskFactorsList>
          {prediction.riskFactors.map((factor, index) => (
            <RiskFactor key={index}>{factor}</RiskFactor>
          ))}
        </RiskFactorsList>
      </Section>

      <Section>
        <SectionTitle>
          <Shield size={16} />
          Recommendations
        </SectionTitle>
        <RecommendationsList>
          {prediction.recommendations.slice(0, 5).map((rec, index) => (
            <Recommendation key={index}>{rec}</Recommendation>
          ))}
        </RecommendationsList>
      </Section>

      <ModelInfo>
        <span>Model: v{prediction.modelVersion}</span>
        <span>Generated: {prediction.timestamp.toLocaleTimeString()}</span>
      </ModelInfo>
    </Container>
  );
};

export default SeverityPredictionCard;
