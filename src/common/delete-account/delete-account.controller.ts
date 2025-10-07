import { Controller, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteAccountService } from './delete-account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Delete Account')
@Controller('delete-account')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeleteAccountController {
  constructor(private deleteAccountService: DeleteAccountService) {}

  @Delete('my-account')
  @ApiOperation({ summary: 'Delete my account (cascade delete everything)' })
  @ApiResponse({
    status: 200,
    description: 'Account and all associated data deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteMyAccount(@Request() req) {
    return this.deleteAccountService.deleteUserAccount(req.user.id);
  }
}
