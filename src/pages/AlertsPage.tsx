import React, { Suspense } from 'react';
import styled from 'styled-components';
import CurrentAlerts from '../components/Dashboard/CurrentAlerts';
import { productionColors, productionCard } from '../styles/production-ui-system';
import { SkeletonAlertsPage } from '../components/Layout/LoadingStates';

const AlertsContainer = styled.div`
  min-height: 100vh;
  padding: 88px 24px 24px;
  background: ${productionColors.background.primary};
  color: ${productionColors.text.primary};
  position: relative;
  z-index: 1;
`;

const PageHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 48px;
`;

const PageTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, ${productionColors.brand.primary}, ${productionColors.brand.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: 18px;
  color: ${productionColors.text.secondary};
  max-width: 800px;
`;

const AlertsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
`;

const AlertCard = styled.div`
  ${productionCard}
  padding: 32px;
`;

const AlertsPage: React.FC = () => {
  return (
    <AlertsContainer>
      <PageHeader>
        <PageTitle>Active Alerts</PageTitle>
        <PageDescription>
          Monitor all active weather advisories, warnings, and emergency alerts for your location.
        </PageDescription>
      </PageHeader>

      <AlertsContent>
        <AlertCard>
          <Suspense fallback={<SkeletonAlertsPage />}>
            <CurrentAlerts />
          </Suspense>
        </AlertCard>
      </AlertsContent>
    </AlertsContainer>
  );
};

export default AlertsPage;
