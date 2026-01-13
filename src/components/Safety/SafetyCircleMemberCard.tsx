import React from 'react';
import styled from 'styled-components';
import { CircleMember, SafetyStatus } from '../../types/safetyCircle';

interface SafetyCircleMemberCardProps {
    member: CircleMember;
    onUpdateStatus: (memberId: string, status: SafetyStatus) => void;
    onCall: (phone: string) => void;
    onViewLocation: (location: { latitude: number; longitude: number }) => void;
}

const MemberCard = styled.div`
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const MemberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MemberInfo = styled.div`
  flex: 1;
  
  .name {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
  }
  
  .contact {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
    margin-bottom: 4px;
  }
  
  .last-checkin {
    color: ${({ theme }) => theme.colors.text.caption};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
  }
`;

const StatusBadge = styled.span<{ status: SafetyStatus }>`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  white-space: nowrap;
  
  ${({ theme, status }) => {
        switch (status) {
            case 'safe':
                return `
          background: ${theme.colors.success[500]};
          color: ${theme.colors.text.inverse};
        `;
            case 'need-help':
                return `
          background: ${theme.colors.warning[500]};
          color: ${theme.colors.text.inverse};
        `;
            case 'emergency':
                return `
          background: ${theme.colors.danger[500]};
          color: ${theme.colors.text.inverse};
          animation: pulse 2s infinite;
        `;
            default:
                return `
          background: ${theme.colors.surface.border};
          color: ${theme.colors.text.secondary};
        `;
        }
    }}
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const PriorityBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .location-text {
    flex: 1;
  }
  
  .view-link {
    color: ${({ theme }) => theme.colors.primary[500]};
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' | 'success' | 'warning' | 'danger' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  border: none;
  
  ${({ theme, variant = 'outline' }) => {
        if (variant === 'primary') {
            return `
        background: ${theme.colors.primary[500]};
        color: ${theme.colors.text.inverse};
        &:hover { background: ${theme.colors.primary[600]}; }
      `;
        } else if (variant === 'success') {
            return `
        background: ${theme.colors.success[500]};
        color: ${theme.colors.text.inverse};
        &:hover { background: ${theme.colors.success[600]}; }
      `;
        } else if (variant === 'warning') {
            return `
        background: ${theme.colors.warning[500]};
        color: ${theme.colors.text.inverse};
        &:hover { background: ${theme.colors.warning[600]}; }
      `;
        } else if (variant === 'danger') {
            return `
        background: ${theme.colors.danger[500]};
        color: ${theme.colors.text.inverse};
        &:hover { background: ${theme.colors.danger[600]}; }
      `;
        } else {
            return `
        background: transparent;
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.surface.border};
        &:hover {
          border-color: ${theme.colors.primary[500]};
          background: ${theme.colors.surface.hover};
        }
      `;
        }
    }}
`;

const SafetyCircleMemberCard: React.FC<SafetyCircleMemberCardProps> = ({
    member,
    onUpdateStatus,
    onCall,
    onViewLocation
}) => {
    const getStatusIcon = (status: SafetyStatus) => {
        switch (status) {
            case 'safe': return '✅';
            case 'need-help': return '⚠️';
            case 'emergency': return '🚨';
            default: return '❓';
        }
    };

    const getStatusText = (status: SafetyStatus) => {
        switch (status) {
            case 'safe': return 'Safe';
            case 'need-help': return 'Need Help';
            case 'emergency': return 'Emergency';
            default: return 'Unknown';
        }
    };

    const getLastCheckInText = () => {
        if (!member.lastCheckIn) return 'Never checked in';

        const now = Date.now();
        const diff = now - member.lastCheckIn;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `Last check-in: ${days}d ago`;
        if (hours > 0) return `Last check-in: ${hours}h ago`;
        if (minutes > 0) return `Last check-in: ${minutes}m ago`;
        return 'Last check-in: Just now';
    };

    return (
        <MemberCard>
            <MemberHeader>
                <MemberInfo>
                    <div className="name">
                        {member.avatar || '👤'} {member.name}
                        {member.isPriority && <PriorityBadge>⭐ Priority</PriorityBadge>}
                    </div>
                    <div className="contact">{member.email}</div>
                    <div className="last-checkin">{getLastCheckInText()}</div>
                </MemberInfo>
                <StatusBadge status={member.status}>
                    {getStatusIcon(member.status)} {getStatusText(member.status)}
                </StatusBadge>
            </MemberHeader>

            {member.location && (
                <LocationInfo>
                    <span>📍</span>
                    <span className="location-text">
                        {member.location.address || `${member.location.latitude.toFixed(4)}, ${member.location.longitude.toFixed(4)}`}
                    </span>
                    <span
                        className="view-link"
                        onClick={() => onViewLocation({ latitude: member.location!.latitude, longitude: member.location!.longitude })}
                    >
                        View on map
                    </span>
                </LocationInfo>
            )}

            <ActionButtons>
                {member.phone && (
                    <Button variant="primary" onClick={() => onCall(member.phone!)}>
                        📞 Call
                    </Button>
                )}
                <Button variant="success" onClick={() => onUpdateStatus(member.id, 'safe')}>
                    ✅ Safe
                </Button>
                <Button variant="warning" onClick={() => onUpdateStatus(member.id, 'need-help')}>
                    ⚠️ Help
                </Button>
                <Button variant="danger" onClick={() => onUpdateStatus(member.id, 'emergency')}>
                    🚨 SOS
                </Button>
            </ActionButtons>
        </MemberCard>
    );
};

export default SafetyCircleMemberCard;
