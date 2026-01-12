import React, { useState } from 'react';
import styled from 'styled-components';
import { SafetyCircle } from '../../types/safetyCircle';

interface CreateCircleFormProps {
    onCreateCircle: (circle: Omit<SafetyCircle, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  resize: vertical;
  min-height: 80px;
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const HelpText = styled.p`
  color: ${({ theme }) => theme.colors.text.caption};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const MemberInputContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MemberTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  
  &:hover {
    opacity: 0.8;
  }
`;

const AddButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.surface.hover};
  }
`;

const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
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
        
        &:disabled {
          background: ${theme.colors.surface.disabled};
          cursor: not-allowed;
          opacity: 0.5;
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

const CreateCircleForm: React.FC<CreateCircleFormProps> = ({ onCreateCircle, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [memberName, setMemberName] = useState('');
    const [members, setMembers] = useState<Array<{ name: string; email: string }>>([]);

    const handleAddMember = () => {
        if (memberEmail && memberName) {
            setMembers([...members, { name: memberName, email: memberEmail }]);
            setMemberEmail('');
            setMemberName('');
        }
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        const circleMembers = members.map((m, index) => ({
            id: `member-${Date.now()}-${index}`,
            name: m.name,
            email: m.email,
            status: 'unknown' as const,
            isPriority: false
        }));

        onCreateCircle({
            name: name.trim(),
            description: description.trim() || undefined,
            members: circleMembers,
            ownerId: 'current-user', // In production, use actual user ID
            locationSharingEnabled: false,
            checkInReminders: []
        });

        // Reset form
        setName('');
        setDescription('');
        setMembers([]);
    };

    return (
        <FormContainer>
            <FormTitle>🆕 Create Safety Circle</FormTitle>

            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="circle-name">Circle Name *</Label>
                    <Input
                        id="circle-name"
                        type="text"
                        placeholder="e.g., Family, Close Friends, Work Team"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="circle-description">Description (Optional)</Label>
                    <TextArea
                        id="circle-description"
                        placeholder="Brief description of this safety circle..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Add Members</Label>
                    <MemberInputContainer>
                        <Input
                            type="text"
                            placeholder="Member name"
                            value={memberName}
                            onChange={(e) => setMemberName(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <Input
                            type="email"
                            placeholder="Member email"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <AddButton type="button" onClick={handleAddMember}>
                            ➕ Add
                        </AddButton>
                    </MemberInputContainer>
                    <HelpText>
                        💡 Add family members, friends, or colleagues to your safety circle
                    </HelpText>

                    {members.length > 0 && (
                        <MemberList>
                            {members.map((member, index) => (
                                <MemberTag key={index}>
                                    👤 {member.name}
                                    <RemoveButton type="button" onClick={() => handleRemoveMember(index)}>
                                        ✕
                                    </RemoveButton>
                                </MemberTag>
                            ))}
                        </MemberList>
                    )}
                </FormGroup>

                <ButtonGroup>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={!name.trim()}>
                        ✅ Create Circle
                    </Button>
                </ButtonGroup>
            </form>
        </FormContainer>
    );
};

export default CreateCircleForm;
