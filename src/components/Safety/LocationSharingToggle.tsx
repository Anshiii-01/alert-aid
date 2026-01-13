import React from 'react';
import styled from 'styled-components';

interface LocationSharingToggleProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    circleId?: string;
}

const ToggleContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ToggleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ToggleInfo = styled.div`
  flex: 1;
  
  .title {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .description {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background: ${({ theme }) => theme.colors.success[500]};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface.border};
  transition: ${({ theme }) => theme.transitions.smooth};
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: ${({ theme }) => theme.transitions.smooth};
    border-radius: 50%;
  }
`;

const StatusIndicator = styled.div<{ enabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, enabled }) =>
        enabled ? theme.colors.success[100] : theme.colors.surface.default
    };
  border: 1px solid ${({ theme, enabled }) =>
        enabled ? theme.colors.success[400] : theme.colors.surface.border
    };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  .icon {
    font-size: 1.5rem;
  }
  
  .status-text {
    flex: 1;
    
    .status-title {
      color: ${({ theme, enabled }) =>
        enabled ? theme.colors.success[700] : theme.colors.text.primary
    };
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      margin-bottom: 4px;
    }
    
    .status-description {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSize.small};
    }
  }
`;

const PermissionNote = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.info[100]};
  border-left: 4px solid ${({ theme }) => theme.colors.info[500]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  .note-title {
    color: ${({ theme }) => theme.colors.info[700]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
  
  .note-text {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const LocationSharingToggle: React.FC<LocationSharingToggleProps> = ({
    enabled,
    onToggle,
    circleId
}) => {
    const handleToggle = async () => {
        if (!enabled) {
            // Request location permission
            if ('geolocation' in navigator) {
                try {
                    await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    onToggle(true);
                } catch (error) {
                    alert('Location permission denied. Please enable location access in your browser settings.');
                }
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        } else {
            onToggle(false);
        }
    };

    return (
        <ToggleContainer>
            <ToggleHeader>
                <ToggleInfo>
                    <div className="title">📍 Location Sharing</div>
                    <div className="description">
                        Share your real-time location with circle members during emergencies
                    </div>
                </ToggleInfo>
                <ToggleSwitch>
                    <ToggleInput
                        type="checkbox"
                        checked={enabled}
                        onChange={handleToggle}
                    />
                    <ToggleSlider />
                </ToggleSwitch>
            </ToggleHeader>

            <StatusIndicator enabled={enabled}>
                <span className="icon">{enabled ? '✅' : '⭕'}</span>
                <div className="status-text">
                    <div className="status-title">
                        {enabled ? 'Location Sharing Active' : 'Location Sharing Disabled'}
                    </div>
                    <div className="status-description">
                        {enabled
                            ? 'Your location is being shared with circle members'
                            : 'Enable to share your location during emergencies'
                        }
                    </div>
                </div>
            </StatusIndicator>

            {!enabled && (
                <PermissionNote>
                    <div className="note-title">ℹ️ Privacy Note</div>
                    <div className="note-text">
                        Your location will only be shared when you enable this feature.
                        You can disable it at any time. Location data is only visible to members
                        of your safety circles.
                    </div>
                </PermissionNote>
            )}
        </ToggleContainer>
    );
};

export default LocationSharingToggle;
