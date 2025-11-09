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
exports.BulkInvitationResponseDto = exports.BulkInvitationDto = exports.AmbassadorDto = exports.InvitationResponseDto = exports.EmailResponseDto = exports.SendInvitationDto = exports.SetUniversityEmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SetUniversityEmailDto {
}
exports.SetUniversityEmailDto = SetUniversityEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'University email address for sending invitations',
        example: 'university@harvard.edu'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetUniversityEmailDto.prototype, "email", void 0);
class SendInvitationDto {
}
exports.SendInvitationDto = SendInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador name',
        example: 'John Doe'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "ambassadorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador email address',
        example: 'ambassador@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "ambassadorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'University name (optional, defaults to user name)',
        example: 'Harvard University',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendInvitationDto.prototype, "universityName", void 0);
class EmailResponseDto {
}
exports.EmailResponseDto = EmailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true
    }),
    __metadata("design:type", Boolean)
], EmailResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Email set successfully'
    }),
    __metadata("design:type", String)
], EmailResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'University email address',
        example: 'university@harvard.edu',
        required: false
    }),
    __metadata("design:type", String)
], EmailResponseDto.prototype, "email", void 0);
class InvitationResponseDto {
}
exports.InvitationResponseDto = InvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the invitation was sent successfully',
        example: true
    }),
    __metadata("design:type", Boolean)
], InvitationResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Invitation sent successfully to ambassador@example.com'
    }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sent to email address',
        example: 'ambassador@example.com'
    }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "sentTo", void 0);
class AmbassadorDto {
}
exports.AmbassadorDto = AmbassadorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador name',
        example: 'John Doe'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmbassadorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador email',
        example: 'john@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmbassadorDto.prototype, "email", void 0);
class BulkInvitationDto {
}
exports.BulkInvitationDto = BulkInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of ambassadors to invite',
        example: [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' }
        ],
        type: [AmbassadorDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AmbassadorDto),
    __metadata("design:type", Array)
], BulkInvitationDto.prototype, "ambassadors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'University name (optional)',
        example: 'Harvard University',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkInvitationDto.prototype, "universityName", void 0);
class BulkInvitationResponseDto {
}
exports.BulkInvitationResponseDto = BulkInvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the bulk operation was successful',
        example: true
    }),
    __metadata("design:type", Boolean)
], BulkInvitationResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Bulk invitations sent successfully'
    }),
    __metadata("design:type", String)
], BulkInvitationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total invitations sent',
        example: 5
    }),
    __metadata("design:type", Number)
], BulkInvitationResponseDto.prototype, "totalSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total invitations failed',
        example: 1
    }),
    __metadata("design:type", Number)
], BulkInvitationResponseDto.prototype, "totalFailed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Details of each invitation',
        example: [
            { name: 'John Doe', email: 'john@example.com', success: true },
            { name: 'Jane Smith', email: 'jane@example.com', success: false, error: 'Invalid email' }
        ]
    }),
    __metadata("design:type", Array)
], BulkInvitationResponseDto.prototype, "results", void 0);
//# sourceMappingURL=email.dto.js.map