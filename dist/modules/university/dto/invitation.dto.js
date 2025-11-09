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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvitationStatusDto = exports.InvitationListResponseDto = exports.InvitedAmbassadorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class InvitedAmbassadorDto {
}
exports.InvitedAmbassadorDto = InvitedAmbassadorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation ID',
        example: 'abc123-def456-ghi789'
    }),
    __metadata("design:type", String)
], InvitedAmbassadorDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador name',
        example: 'John Doe'
    }),
    __metadata("design:type", String)
], InvitedAmbassadorDto.prototype, "ambassadorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador email',
        example: 'john.doe@example.com'
    }),
    __metadata("design:type", String)
], InvitedAmbassadorDto.prototype, "ambassadorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation status',
        example: 'INVITED',
        enum: ['INVITED', 'ACCEPTED', 'DECLINED', 'JOINED']
    }),
    __metadata("design:type", String)
], InvitedAmbassadorDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the invitation was sent',
        example: '2025-01-08T10:30:00Z'
    }),
    __metadata("design:type", String)
], InvitedAmbassadorDto.prototype, "invitedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the ambassador responded (if any)',
        example: '2025-01-08T11:30:00Z',
        required: false
    }),
    __metadata("design:type", String)
], InvitedAmbassadorDto.prototype, "respondedAt", void 0);
class InvitationListResponseDto {
}
exports.InvitationListResponseDto = InvitationListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of invited ambassadors',
        type: [InvitedAmbassadorDto]
    }),
    __metadata("design:type", Array)
], InvitationListResponseDto.prototype, "invitations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total count of invitations',
        example: 15
    }),
    __metadata("design:type", Number)
], InvitationListResponseDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Count by status',
        example: { INVITED: 5, ACCEPTED: 8, DECLINED: 2, JOINED: 3 }
    }),
    __metadata("design:type", Object)
], InvitationListResponseDto.prototype, "statusCounts", void 0);
class UpdateInvitationStatusDto {
}
exports.UpdateInvitationStatusDto = UpdateInvitationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New invitation status',
        example: 'ACCEPTED',
        enum: ['ACCEPTED', 'DECLINED']
    }),
    __metadata("design:type", String)
], UpdateInvitationStatusDto.prototype, "status", void 0);
//# sourceMappingURL=invitation.dto.js.map