import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import {
  AdminDashboardStatsDto,
  AdminUniversityListDto,
  AdminAmbassadorListDto,
  AdminChatClickDto,
  AdminInvitationDto,
} from './dto/admin-response.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: AdminDashboardStatsDto,
  })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('universities')
  @ApiOperation({ summary: 'Get all universities with statistics' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Universities retrieved successfully',
  })
  async getAllUniversities(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllUniversities(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('ambassadors')
  @ApiOperation({ summary: 'Get all ambassadors with profiles' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Ambassadors retrieved successfully',
  })
  async getAllAmbassadors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllAmbassadors(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('chat-clicks')
  @ApiOperation({ summary: 'Get all chat clicks/messages' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 100 })
  @ApiResponse({
    status: 200,
    description: 'Chat clicks retrieved successfully',
  })
  async getAllChatClicks(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllChatClicks(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 100,
    );
  }

  @Get('invitations')
  @ApiOperation({ summary: 'Get all invitations' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 100 })
  @ApiResponse({
    status: 200,
    description: 'Invitations retrieved successfully',
  })
  async getAllInvitations(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllInvitations(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 100,
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (universities and ambassadors)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('analytics/countries')
  @ApiOperation({ summary: 'Get analytics by country' })
  @ApiResponse({
    status: 200,
    description: 'Country analytics retrieved successfully',
  })
  async getAnalyticsByCountry() {
    return this.adminService.getAnalyticsByCountry();
  }

  @Get('analytics/widgets')
  @ApiOperation({ summary: 'Get widget analytics' })
  @ApiResponse({
    status: 200,
    description: 'Widget analytics retrieved successfully',
  })
  async getWidgetAnalytics() {
    return this.adminService.getWidgetAnalytics();
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserDetails(@Param('userId') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  @Delete('users/:userId')
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete admin user',
  })
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }
}

