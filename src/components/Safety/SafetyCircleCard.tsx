import React from 'react';
import styled from 'styled-components';
import { SafetyCircle } from '../../types/safetyCircle';

interface SafetyCircleCardProps {
    circle: SafetyCircle;
    onViewMembers: (circleId: string) => void;
    onCheckIn: (circleId: string) => void;
    onDelete: (circleId: string) => void;
}

const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.glowRed};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CircleInfo = styled.div`
  flex: 1;
  
  .name {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .description {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  .meta {
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.caption};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    flex-wrap: wrap;
  }
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  
  background: ${({ theme, status }) =>
        status === 'active' ? theme.colors.success[500] : theme.colors.surface.border
    };
  color: ${({ theme }) => theme.colors.text.inverse};
`;

const MemberStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatItem = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  .icon {
    font-size: 1.2rem;
  }
  
  .count {
    color: ${({ theme, color }) => color || theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
  
  .label {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  border: none;
  
  ${({ theme, variant = 'outline' }) => {
        if (variant === 'primary') {
            return `
        background: ${theme.colors.primary[500]};
        color: ${theme.colors.text.inverse};
        
        &:hover {
          background: ${theme.colors.primary[600]};
          box-shadow: ${theme.shadows.glowRed};
        }
      `;
        } else if (variant === 'danger') {
            return `
        background: ${theme.colors.danger[500]};
        color: ${theme.colors.text.inverse};
        
        &:hover {
          background: ${theme.colors.danger[600]};
        }
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

const SafetyCircleCard: React.FC<SafetyCircleCardProps> = ({
    circle,
    onViewMembers,
    onCheckIn,
    onDelete
}) => {
    const getMemberStatusCounts = () => {
        const counts = {
            safe: 0,
            needHelp: 0,
            emergency: 0,
            unknown: 0
        };

        circle.members.forEach(member => {
            if (member.status === 'safe') counts.safe++;
            else if (member.status === 'need-help') counts.needHelp++;
            else if (member.status === 'emergency') counts.emergency++;
            else counts.unknown++;
        });

        return counts;
    };

    const getLastActivity = () => {
        const timestamps = circle.members
            .map(m => m.lastCheckIn)
            .filter(t => t !== undefined) as number[];

        if (timestamps.length === 0) return 'No activity';

        const latest = Math.max(...timestamps);
        const now = Date.now();
        const diff = now - latest;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const statusCounts = getMemberStatusCounts();
    const isActive = circle.locationSharingEnabled || statusCounts.safe > 0;

    return (
        <CardContainer>
            <CardHeader>
                <CircleInfo>
                    <div className="name">👥 {circle.name}</div>
                    {circle.description && (
                        <div className="description">{circle.description}</div>
                    )}
                    <div className="meta">
                        <span>👤 {circle.members.length} members</span>
                        <span>🕐 {getLastActivity()}</span>
                    </div>
                </CircleInfo>
                <StatusBadge status={isActive ? 'active' : 'inactive'}>
                    {isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
            </CardHeader>

            <MemberStats>
                <StatItem color="#22C55E">
                    <span className="icon">✅</span>
                    <div>
                        <div className="count">{statusCounts.safe}</div>
                        <div className="label">Safe</div>
                    </div>
                </StatItem>

                <StatItem color="#F59E0B">
                    <span className="icon">⚠️</span>
                    <div>
                        <div className="count">{statusCounts.needHelp}</div>
                        <div className="label">Need Help</div>
                    </div>
                </StatItem>

                <StatItem color="#EF4444">
                    <span className="icon">🚨</span>
                    <div>
                        <div className="count">{statusCounts.emergency}</div>
                        <div className="label">Emergency</div>
                    </div>
                </StatItem>

                <StatItem>
                    <span className="icon">❓</span>
                    <div>
                        <div className="count">{statusCounts.unknown}</div>
                        <div className="label">Unknown</div>
                    </div>
                </StatItem>
            </MemberStats>

            <ActionButtons>
                <Button variant="primary" onClick={() => onViewMembers(circle.id)}>
                    👁️ View Members
                </Button>
                <Button variant="outline" onClick={() => onCheckIn(circle.id)}>
                    ✅ Check In
                </Button>
                <Button variant="danger" onClick={() => onDelete(circle.id)}>
                    🗑️ Delete
                </Button>
            </ActionButtons>
        </CardContainer>
    );
};

export default SafetyCircleCard;
