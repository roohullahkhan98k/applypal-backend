import { ApiProperty } from '@nestjs/swagger';

export class InvitedAmbassadorDto {
  @ApiProperty({ 
    description: 'Invitation ID',
    example: 'abc123-def456-ghi789'
  })
  id: string;

  @ApiProperty({ 
    description: 'Ambassador name',
    example: 'John Doe'
  })
  ambassadorName: string;

  @ApiProperty({ 
    description: 'Ambassador email',
    example: 'john.doe@example.com'
  })
  ambassadorEmail: string;

  @ApiProperty({ 
    description: 'Invitation status',
    example: 'INVITED',
    enum: ['INVITED', 'ACCEPTED', 'DECLINED', 'JOINED']
  })
  status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'JOINED';

  @ApiProperty({ 
    description: 'When the invitation was sent',
    example: '2025-01-08T10:30:00Z'
  })
  invitedAt: string;

  @ApiProperty({ 
    description: 'When the ambassador responded (if any)',
    example: '2025-01-08T11:30:00Z',
    required: false
  })
  respondedAt?: string;
}

export class InvitationListResponseDto {
  @ApiProperty({ 
    description: 'List of invited ambassadors',
    type: [InvitedAmbassadorDto]
  })
  invitations: InvitedAmbassadorDto[];

  @ApiProperty({ 
    description: 'Total count of invitations',
    example: 15
  })
  totalCount: number;

  @ApiProperty({ 
    description: 'Count by status',
    example: { INVITED: 5, ACCEPTED: 8, DECLINED: 2, JOINED: 3 }
  })
  statusCounts: {
    INVITED: number;
    ACCEPTED: number;
    DECLINED: number;
    JOINED: number;
  };
}

export class UpdateInvitationStatusDto {
  @ApiProperty({ 
    description: 'New invitation status',
    example: 'ACCEPTED',
    enum: ['ACCEPTED', 'DECLINED']
  })
  status: 'ACCEPTED' | 'DECLINED';
}
