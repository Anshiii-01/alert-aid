import React from 'react';
import styled from 'styled-components';
import { CheckInReminder } from '../../types/safetyCircle';

interface CheckInReminderSettingsProps {
    reminders: CheckInReminder[];
    onUpdateReminder: (reminder: CheckInReminder) => void;
    onCreateReminder: (circleId: string, frequency: CheckInReminder['frequency']) => void;
    circleIds: string[];
}

const SettingsContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SettingsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SettingsDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ReminderCard = styled.div`
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReminderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ReminderInfo = styled.div`
  flex: 1;
  
  .circle-name {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: 4px;
  }
  
  .frequency {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background: ${({ theme }) => theme.colors.success[500]};
  }
  
  &:checked + span:before {
    transform: translateX(22px);
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
  border-radius: 28px;
  
  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: ${({ theme }) => theme.transitions.smooth};
    border-radius: 50%;
  }
`;

const FrequencySelector = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
`;

const NextReminderInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.info[100]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.info[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .icon {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .message {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const InfoBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.warning[100]};
  border-left: 4px solid ${({ theme }) => theme.colors.warning[500]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  .info-title {
    color: ${({ theme }) => theme.colors.warning[700]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
  
  .info-text {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  }
`;

const CheckInReminderSettings: React.FC<CheckInReminderSettingsProps> = ({
    reminders,
    onUpdateReminder,
    onCreateReminder,
    circleIds
}) => {
    const getFrequencyText = (frequency: CheckInReminder['frequency']) => {
        switch (frequency) {
            case 'hourly': return 'Every hour';
            case '3-hours': return 'Every 3 hours';
            case '6-hours': return 'Every 6 hours';
            case 'daily': return 'Once daily';
            case 'custom': return 'Custom interval';
            default: return frequency;
        }
    };

    const getNextReminderText = (reminder: CheckInReminder) => {
        if (!reminder.enabled || !reminder.nextReminder) return null;

        const now = Date.now();
        const diff = reminder.nextReminder - now;

        if (diff <= 0) return 'Due now';

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `Next reminder in ${hours}h ${minutes % 60}m`;
        return `Next reminder in ${minutes}m`;
    };

    const handleToggle = (reminder: CheckInReminder) => {
        onUpdateReminder({
            ...reminder,
            enabled: !reminder.enabled,
            nextReminder: !reminder.enabled ? Date.now() + getIntervalMs(reminder.frequency) : undefined
        });
    };

    const handleFrequencyChange = (reminder: CheckInReminder, frequency: CheckInReminder['frequency']) => {
        onUpdateReminder({
            ...reminder,
            frequency,
            nextReminder: reminder.enabled ? Date.now() + getIntervalMs(frequency) : undefined
        });
    };

    const getIntervalMs = (frequency: CheckInReminder['frequency']) => {
        switch (frequency) {
            case 'hourly': return 60 * 60 * 1000;
            case '3-hours': return 3 * 60 * 60 * 1000;
            case '6-hours': return 6 * 60 * 60 * 1000;
            case 'daily': return 24 * 60 * 60 * 1000;
            default: return 60 * 60 * 1000;
        }
    };

    return (
        <SettingsContainer>
            <SettingsTitle>⏰ Check-In Reminders</SettingsTitle>
            <SettingsDescription>
                Set up automated reminders to check in with your safety circles during emergencies
            </SettingsDescription>

            {reminders.length === 0 ? (
                <EmptyState>
                    <div className="icon">🔔</div>
                    <div className="message">
                        No check-in reminders configured yet. Create a safety circle to set up reminders.
                    </div>
                </EmptyState>
            ) : (
                <>
                    {reminders.map((reminder) => (
                        <ReminderCard key={reminder.id}>
                            <ReminderHeader>
                                <ReminderInfo>
                                    <div className="circle-name">
                                        Circle Reminder
                                    </div>
                                    <div className="frequency">
                                        {getFrequencyText(reminder.frequency)}
                                    </div>
                                </ReminderInfo>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        checked={reminder.enabled}
                                        onChange={() => handleToggle(reminder)}
                                    />
                                    <ToggleSlider />
                                </ToggleSwitch>
                            </ReminderHeader>

                            <FrequencySelector
                                value={reminder.frequency}
                                onChange={(e) => handleFrequencyChange(reminder, e.target.value as CheckInReminder['frequency'])}
                                disabled={!reminder.enabled}
                            >
                                <option value="hourly">Every hour</option>
                                <option value="3-hours">Every 3 hours</option>
                                <option value="6-hours">Every 6 hours</option>
                                <option value="daily">Once daily</option>
                            </FrequencySelector>

                            {reminder.enabled && reminder.nextReminder && (
                                <NextReminderInfo>
                                    ⏰ {getNextReminderText(reminder)}
                                </NextReminderInfo>
                            )}
                        </ReminderCard>
                    ))}
                </>
            )}

            <InfoBox>
                <div className="info-title">💡 How it works</div>
                <div className="info-text">
                    When enabled, you'll receive browser notifications reminding you to check in with your
                    safety circle. This helps keep everyone informed during emergencies.
                </div>
            </InfoBox>
        </SettingsContainer>
    );
};

export default CheckInReminderSettings;
