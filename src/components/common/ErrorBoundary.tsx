import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import logger from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 200px;
  text-align: center;
  gap: 16px;
`;

const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => `${theme.colors.error}20`};
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 300px;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.surface.hover};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.pressed};
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`Uncaught error in ${this.props.componentName || 'Component'}:`, error, errorInfo);
    
    // Here you would typically log to Sentry
    // Sentry.captureException(error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Ideally, this would trigger a re-fetch in the child component
    // For now, it just remounts the children
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>
            <AlertTriangle size={24} />
          </ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.props.componentName 
              ? `The ${this.props.componentName} component encountered an error.` 
              : 'An unexpected error occurred.'}
          </ErrorMessage>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ fontSize: '0.7rem', textAlign: 'left', background: '#000', padding: '8px', borderRadius: '4px', overflow: 'auto', maxWidth: '100%' }}>
              {this.state.error.toString()}
            </pre>
          )}
          <RetryButton onClick={this.handleRetry}>
            <RefreshCw size={14} />
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
