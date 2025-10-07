import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  Request,
  ValidationPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiConsumes,
  ApiBody 
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AmbassadorService } from './ambassador.service';
import { CreateAmbassadorProfileDto, UpdateAmbassadorProfileDto } from './dto/ambassador-profile.dto';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { MultipartTransformPipe } from '../../common/pipes/multipart-transform.pipe';

@ApiTags('Ambassador')
@Controller('ambassador')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AmbassadorController {
  constructor(private ambassadorService: AmbassadorService) {}

  @Post('profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({ summary: 'Create ambassador profile' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Ambassador profile created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Profile already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createProfile(
    @Request() req,
    @Body(new MultipartTransformPipe(), new ValidationPipe()) profileData: CreateAmbassadorProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.ambassadorService.createProfile(req.user.id, profileData, file);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user ambassador profile' })
  @ApiResponse({
    status: 200,
    description: 'Ambassador profile retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMyProfile(@Request() req) {
    return this.ambassadorService.getProfile(req.user.id);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get ambassador profile by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Ambassador profile retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Param('userId') userId: string) {
    return this.ambassadorService.getProfile(userId);
  }

  @Get('profiles')
  @ApiOperation({ summary: 'Get all ambassador profiles' })
  @ApiResponse({
    status: 200,
    description: 'All ambassador profiles retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAllProfiles() {
    return this.ambassadorService.getAllProfiles();
  }

  @Put('profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({ summary: 'Update ambassador profile' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Ambassador profile updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateProfile(
    @Request() req,
    @Body(new MultipartTransformPipe(), new ValidationPipe()) profileData: UpdateAmbassadorProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.ambassadorService.updateProfile(req.user.id, profileData, file);
  }


  @Delete('profile')
  @ApiOperation({ summary: 'Delete ambassador profile' })
  @ApiResponse({
    status: 200,
    description: 'Ambassador profile deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteProfile(@Request() req) {
    return this.ambassadorService.deleteProfile(req.user.id);
  }
}
