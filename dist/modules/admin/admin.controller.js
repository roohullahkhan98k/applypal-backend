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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../../common/auth/jwt-auth.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
const admin_response_dto_1 = require("./dto/admin-response.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    async getAllUniversities(page, limit) {
        return this.adminService.getAllUniversities(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    }
    async getAllAmbassadors(page, limit) {
        return this.adminService.getAllAmbassadors(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    }
    async getAllChatClicks(page, limit) {
        return this.adminService.getAllChatClicks(page ? parseInt(page) : 1, limit ? parseInt(limit) : 100);
    }
    async getAllInvitations(page, limit) {
        return this.adminService.getAllInvitations(page ? parseInt(page) : 1, limit ? parseInt(limit) : 100);
    }
    async getAllUsers(page, limit) {
        return this.adminService.getAllUsers(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    }
    async getAnalyticsByCountry() {
        return this.adminService.getAnalyticsByCountry();
    }
    async getWidgetAnalytics() {
        return this.adminService.getWidgetAnalytics();
    }
    async getUserDetails(userId) {
        return this.adminService.getUserDetails(userId);
    }
    async deleteUser(userId) {
        return this.adminService.deleteUser(userId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard statistics retrieved successfully',
        type: admin_response_dto_1.AdminDashboardStatsDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('universities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all universities with statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Universities retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUniversities", null);
__decorate([
    (0, common_1.Get)('ambassadors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ambassadors with profiles' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ambassadors retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAmbassadors", null);
__decorate([
    (0, common_1.Get)('chat-clicks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all chat clicks/messages' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 100 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat clicks retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllChatClicks", null);
__decorate([
    (0, common_1.Get)('invitations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all invitations' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 100 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitations retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllInvitations", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (universities and ambassadors)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('analytics/countries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics by country' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Country analytics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalyticsByCountry", null);
__decorate([
    (0, common_1.Get)('analytics/widgets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get widget analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Widget analytics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWidgetAnalytics", null);
__decorate([
    (0, common_1.Get)('users/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user details by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Delete)('users/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a user (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Cannot delete admin user',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map