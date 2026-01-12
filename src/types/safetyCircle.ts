// Safety Circle Types for Family Safety Network Feature

export type SafetyStatus = 'safe' | 'need-help' | 'emergency' | 'unknown';

export interface LocationShare {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  address?: string;
}

export interface CircleMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: SafetyStatus;
  lastCheckIn?: number;
  location?: LocationShare;
  isPriority: boolean; // Emergency contact prioritization
  avatar?: string;
}

export interface CheckInReminder {
  id: string;
  circleId: string;
  frequency: 'hourly' | '3-hours' | '6-hours' | 'daily' | 'custom';
  enabled: boolean;
  lastReminder?: number;
  nextReminder?: number;
  customInterval?: number; // in minutes
}

export interface SafetyCircle {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  members: CircleMember[];
  ownerId: string; // Current user's ID
  locationSharingEnabled: boolean;
  checkInReminders: CheckInReminder[];
}

export interface SafetyNetworkSettings {
  locationSharingEnabled: boolean;
  notificationsEnabled: boolean;
  autoCheckInEnabled: boolean;
  defaultCheckInFrequency: CheckInReminder['frequency'];
}
