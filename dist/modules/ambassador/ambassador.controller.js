"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const ambassador_service_1 = require("./ambassador.service");
const ambassador_profile_dto_1 = require("./dto/ambassador-profile.dto");
const jwt_auth_guard_1 = require("../../common/auth/jwt-auth.guard");
const multipart_transform_pipe_1 = require("../../common/pipes/multipart-transform.pipe");
let AmbassadorController = class AmbassadorController {
    constructor(ambassadorService) {
        this.ambassadorService = ambassadorService;
    }
    async createProfile(req, profileData, file) {
        return this.ambassadorService.createProfile(req.user.id, profileData, file);
    }
    async getMyProfile(req) {
        return this.ambassadorService.getProfile(req.user.id);
    }
    async getProfile(userId) {
        return this.ambassadorService.getProfile(userId);
    }
    async getAllProfiles() {
        return this.ambassadorService.getAllProfiles();
    }
    async updateProfile(req, profileData, file) {
        return this.ambassadorService.updateProfile(req.user.id, profileData, file);
    }
    async deleteProfile(req) {
        return this.ambassadorService.deleteProfile(req.user.id);
    }
};
exports.AmbassadorController = AmbassadorController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage')),
    (0, swagger_1.ApiOperation)({ summary: 'Create ambassador profile' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Ambassador profile created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Profile already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new multipart_transform_pipe_1.MultipartTransformPipe(), new common_1.ValidationPipe())),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ambassador_profile_dto_1.CreateAmbassadorProfileDto, Object]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user ambassador profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ambassador profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Profile not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)('profile/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ambassador profile by user ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ambassador profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Profile not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('profiles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ambassador profiles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All ambassador profiles retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "getAllProfiles", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage')),
    (0, swagger_1.ApiOperation)({ summary: 'Update ambassador profile' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ambassador profile updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Profile not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new multipart_transform_pipe_1.MultipartTransformPipe(), new common_1.ValidationPipe())),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ambassador_profile_dto_1.UpdateAmbassadorProfileDto, Object]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ambassador profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ambassador profile deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Profile not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "deleteProfile", null);
exports.AmbassadorController = AmbassadorController = __decorate([
    (0, swagger_1.ApiTags)('Ambassador'),
    (0, common_1.Controller)('ambassador'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ambassador_service_1.AmbassadorService])
], AmbassadorController);
//# sourceMappingURL=ambassador.controller.js.map