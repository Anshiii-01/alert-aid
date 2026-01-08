/**
 * Damage Assessment Component
 * Upload and analyze disaster damage images
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Camera, Upload, AlertTriangle, CheckCircle, DollarSign, Loader, Image as ImageIcon, X } from 'lucide-react';
import { imageRecognitionService, DamageAnalysisResult } from '../../services/imageRecognitionService';
import { productionColors } from '../../styles/production-ui-system';

const Container = styled.div`
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 16px;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  padding: 4px 10px;
  background: linear-gradient(135deg, #10B981, #3B82F6);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  color: white;
`;

const UploadZone = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${props => props.$isDragging ? productionColors.brand.primary : productionColors.border.secondary};
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isDragging ? 'rgba(239, 68, 68, 0.1)' : 'transparent'};

  &:hover {
    border-color: ${productionColors.brand.primary};
    background: rgba(239, 68, 68, 0.05);
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${productionColors.text.secondary};
`;

const UploadText = styled.p`
  color: ${productionColors.text.secondary};
  font-size: 16px;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.p`
  color: ${productionColors.text.tertiary};
  font-size: 14px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${productionColors.brand.primary};
  }
`;

const AnalyzeButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${productionColors.brand.primary};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${productionColors.brand.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 24px;
`;

const SeverityBanner = styled.div<{ $severity: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  background: ${props => {
    switch (props.$severity) {
      case 'destroyed': return 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.3))';
      case 'severe': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))';
      case 'moderate': return 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.3))';
      case 'minor': return 'linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(202, 138, 4, 0.3))';
      default: return 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))';
    }
  }};
`;

const SeverityInfo = styled.div``;

const SeverityLabel = styled.div`
  font-size: 14px;
  color: ${productionColors.text.secondary};
  margin-bottom: 4px;
`;

const SeverityValue = styled.div<{ $severity: string }>`
  font-size: 28px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${props => {
    switch (props.$severity) {
      case 'destroyed': return '#DC2626';
      case 'severe': return '#EF4444';
      case 'moderate': return '#F97316';
      case 'minor': return '#EAB308';
      default: return '#22C55E';
    }
  }};
`;

const ConfidenceBadge = styled.div`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: ${productionColors.text.secondary};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${productionColors.border.secondary};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: ${productionColors.text.tertiary};
  margin-bottom: 8px;
`;

const MetricValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${productionColors.text.primary};
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${productionColors.text.secondary};
  margin-bottom: 12px;
`;

const DetectedObjectsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ObjectTag = styled.span<{ $state: string }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  background: ${props => {
    switch (props.$state) {
      case 'destroyed': return 'rgba(239, 68, 68, 0.2)';
      case 'damaged': return 'rgba(249, 115, 22, 0.2)';
      default: return 'rgba(34, 197, 94, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.$state) {
      case 'destroyed': return '#EF4444';
      case 'damaged': return '#F97316';
      default: return '#22C55E';
    }
  }};
`;

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Recommendation = styled.li`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid ${productionColors.brand.primary};
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${productionColors.text.secondary};
`;

export const DamageAssessment: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DamageAnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const analysisResult = await imageRecognitionService.analyzeImage(selectedImage);
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <Container>
      <Header>
        <Title>
          <Camera size={24} />
          Damage Assessment
          <AIBadge>AI Vision</AIBadge>
        </Title>
      </Header>

      {!selectedImage ? (
        <UploadZone
          $isDragging={isDragging}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <UploadIcon>
            <Upload size={32} />
          </UploadIcon>
          <UploadText>Drop image here or click to upload</UploadText>
          <UploadSubtext>Supports JPG, PNG up to 10MB</UploadSubtext>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </UploadZone>
      ) : (
        <>
          <PreviewContainer>
            <PreviewImage src={previewUrl!} alt="Damage preview" />
            <RemoveButton onClick={clearImage}>
              <X size={16} />
            </RemoveButton>
          </PreviewContainer>

          <AnalyzeButton onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader size={20} className="spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                Analyze Damage
              </>
            )}
          </AnalyzeButton>
        </>
      )}

      {result && (
        <ResultsContainer>
          <SeverityBanner $severity={result.severity}>
            <SeverityInfo>
              <SeverityLabel>Damage Severity</SeverityLabel>
              <SeverityValue $severity={result.severity}>
                {result.severity}
              </SeverityValue>
            </SeverityInfo>
            <ConfidenceBadge>
              {Math.round(result.confidence * 100)}% confidence
            </ConfidenceBadge>
          </SeverityBanner>

          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Damage Type</MetricLabel>
              <MetricValue>{result.damageType.replace(/_/g, ' ')}</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Affected Area</MetricLabel>
              <MetricValue>{result.affectedArea.percentage}%</MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Est. Cost</MetricLabel>
              <MetricValue>
                {formatCurrency(result.estimatedCost.min)} - {formatCurrency(result.estimatedCost.max)}
              </MetricValue>
            </MetricCard>
          </MetricsGrid>

          <Section>
            <SectionTitle>Detected Objects</SectionTitle>
            <DetectedObjectsList>
              {result.detectedObjects.map((obj, i) => (
                <ObjectTag key={i} $state={obj.damageState}>
                  {obj.label} ({Math.round(obj.confidence * 100)}%)
                </ObjectTag>
              ))}
            </DetectedObjectsList>
          </Section>

          <Section>
            <SectionTitle>Recommendations</SectionTitle>
            <RecommendationsList>
              {result.recommendations.map((rec, i) => (
                <Recommendation key={i}>{rec}</Recommendation>
              ))}
            </RecommendationsList>
          </Section>
        </ResultsContainer>
      )}
    </Container>
  );
};

export default DamageAssessment;
