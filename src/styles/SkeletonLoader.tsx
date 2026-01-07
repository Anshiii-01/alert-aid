/**
 * Skeleton Loading Components
 * Provides shimmer loading states for various content types
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { productionColors } from './production-ui-system';

// Shimmer animation
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

// Base skeleton component
const SkeletonBase = styled.div<{ $width?: string; $height?: string; $borderRadius?: string }>`
  position: relative;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  animation: ${pulse} 2s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s infinite;
  }
`;

// Card skeleton
export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: ${props => props.$height || '200px'};
  border-radius: 16px;
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
`;

// Text skeleton
export const SkeletonText = styled(SkeletonBase)<{ $lines?: number }>`
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '16px'};
  border-radius: 4px;
  margin-bottom: 8px;

  ${props => props.$lines && props.$lines > 1 && `
    &::before {
      content: '';
      position: absolute;
      top: 24px;
      left: 0;
      width: 80%;
      height: 16px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
    }
  `}
`;

// Avatar/Circle skeleton
export const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.$width || '48px'};
  height: ${props => props.$height || '48px'};
  border-radius: 50%;
`;

// Button skeleton
export const SkeletonButton = styled(SkeletonBase)`
  width: ${props => props.$width || '120px'};
  height: ${props => props.$height || '40px'};
  border-radius: 8px;
`;

// Chart skeleton
export const SkeletonChart = styled(SkeletonBase)`
  width: 100%;
  height: ${props => props.$height || '300px'};
  border-radius: 12px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    height: 60%;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 30%,
      rgba(255, 255, 255, 0.05) 60%,
      transparent 100%
    );
    clip-path: polygon(
      0% 70%, 10% 60%, 20% 50%, 30% 55%, 40% 40%,
      50% 30%, 60% 35%, 70% 25%, 80% 20%, 90% 15%, 100% 10%,
      100% 100%, 0% 100%
    );
  }
`;

// Dashboard Card Skeleton
const DashboardCardContainer = styled.div`
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SkeletonDashboardCard: React.FC = () => (
  <DashboardCardContainer>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <SkeletonCircle $width="40px" $height="40px" />
      <div style={{ flex: 1 }}>
        <SkeletonText $width="60%" $height="18px" />
        <SkeletonText $width="40%" $height="14px" />
      </div>
    </div>
    <SkeletonChart $height="180px" />
    <div style={{ display: 'flex', gap: '12px' }}>
      <SkeletonButton $width="100px" />
      <SkeletonButton $width="100px" />
    </div>
  </DashboardCardContainer>
);

// Alert Card Skeleton
const AlertCardContainer = styled.div`
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const SkeletonAlertCard: React.FC = () => (
  <AlertCardContainer>
    <SkeletonCircle $width="48px" $height="48px" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SkeletonText $width="80%" $height="16px" />
      <SkeletonText $width="60%" $height="14px" />
      <SkeletonText $width="40%" $height="12px" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <SkeletonButton $width="80px" $height="32px" />
        <SkeletonButton $width="80px" $height="32px" />
      </div>
    </div>
  </AlertCardContainer>
);

// Map Skeleton
const MapContainer = styled.div`
  width: 100%;
  height: ${props => props.style?.height || '400px'};
  border-radius: 16px;
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(239, 68, 68, 0.1) 0%,
      transparent 70%
    );
    animation: ${pulse} 3s ease-in-out infinite;
  }
`;

export const SkeletonMap: React.FC<{ height?: string }> = ({ height }) => (
  <MapContainer style={{ height }}>
    <SkeletonBase $width="100%" $height="100%" $borderRadius="16px" />
  </MapContainer>
);

// List Skeleton
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <ListContainer>
    {Array.from({ length: items }).map((_, index) => (
      <AlertCardContainer key={index}>
        <SkeletonCircle $width="40px" $height="40px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SkeletonText $width={`${80 - index * 10}%`} $height="16px" />
          <SkeletonText $width={`${60 - index * 5}%`} $height="14px" />
        </div>
      </AlertCardContainer>
    ))}
  </ListContainer>
);

// Table Skeleton
const TableContainer = styled.div`
  background: ${productionColors.background.secondary};
  border: 1px solid ${productionColors.border.primary};
  border-radius: 12px;
  overflow: hidden;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid ${productionColors.border.secondary};

  &:last-child {
    border-bottom: none;
  }
`;

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <TableContainer>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonText 
            key={colIndex}
            $width={rowIndex === 0 ? '80%' : '90%'} 
            $height={rowIndex === 0 ? '18px' : '16px'}
          />
        ))}
      </TableRow>
    ))}
  </TableContainer>
);

// Page Loading Skeleton
const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const SkeletonPage: React.FC = () => (
  <PageContainer>
    <div>
      <SkeletonText $width="40%" $height="32px" style={{ marginBottom: '16px' }} />
      <SkeletonText $width="60%" $height="16px" />
    </div>
    <Grid>
      <SkeletonDashboardCard />
      <SkeletonDashboardCard />
      <SkeletonDashboardCard />
    </Grid>
    <SkeletonChart $height="400px" />
    <SkeletonList items={5} />
  </PageContainer>
);
