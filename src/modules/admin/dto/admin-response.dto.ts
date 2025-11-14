import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardStatsDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalUniversities: number;

  @ApiProperty()
  totalAmbassadors: number;

  @ApiProperty()
  totalChatClicks: number;

  @ApiProperty()
  totalInvitations: number;

  @ApiProperty()
  activeWidgets: number;

  @ApiProperty()
  verifiedWidgets: number;

  @ApiProperty()
  recentChatClicks: number; // Last 24 hours

  @ApiProperty()
  recentSignups: number; // Last 7 days
}

export class AdminUniversityListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  university: string;

  @ApiProperty()
  widgetId?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  universityEmail?: string;

  @ApiProperty()
  totalInvitations: number;

  @ApiProperty()
  totalChatClicks: number;

  @ApiProperty()
  createdAt: Date;
}

export class AdminAmbassadorListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  university: string;

  @ApiProperty()
  subject?: string;

  @ApiProperty()
  countryOriginal?: string;

  @ApiProperty()
  countryCurrent?: string;

  @ApiProperty()
  currentUniversityName?: string;

  @ApiProperty()
  profileImage?: string;

  @ApiProperty()
  hasProfile: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class AdminChatClickDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  widgetId: string;

  @ApiProperty()
  domain: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  ambassadorId?: string;

  @ApiProperty()
  ambassadorName?: string;

  @ApiProperty()
  question1Answer?: string;

  @ApiProperty()
  question2Answer?: string;

  @ApiProperty()
  clickedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  universityName?: string;
}

export class AdminInvitationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  universityId: string;

  @ApiProperty()
  universityName: string;

  @ApiProperty()
  ambassadorName: string;

  @ApiProperty()
  ambassadorEmail: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  invitedAt: Date;

  @ApiProperty()
  respondedAt?: Date;
}

