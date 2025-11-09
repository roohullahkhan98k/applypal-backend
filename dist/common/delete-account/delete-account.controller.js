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
exports.DeleteAccountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delete_account_service_1 = require("./delete-account.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DeleteAccountController = class DeleteAccountController {
    constructor(deleteAccountService) {
        this.deleteAccountService = deleteAccountService;
    }
    async deleteMyAccount(req) {
        return this.deleteAccountService.deleteUserAccount(req.user.id);
    }
};
exports.DeleteAccountController = DeleteAccountController;
__decorate([
    (0, common_1.Delete)('my-account'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete my account (cascade delete everything)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account and all associated data deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeleteAccountController.prototype, "deleteMyAccount", null);
exports.DeleteAccountController = DeleteAccountController = __decorate([
    (0, swagger_1.ApiTags)('Delete Account'),
    (0, common_1.Controller)('delete-account'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [delete_account_service_1.DeleteAccountService])
], DeleteAccountController);
//# sourceMappingURL=delete-account.controller.js.map