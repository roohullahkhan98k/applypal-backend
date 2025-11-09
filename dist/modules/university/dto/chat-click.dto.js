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
exports.ChatClickAnalyticsDto = exports.ChatClickAnswersResponseDto = exports.ChatClickAnswersDto = exports.ChatClickResponseDto = exports.ChatClickDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChatClickDto {
}
exports.ChatClickDto = ChatClickDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Widget ID that was clicked',
        example: 'abc123-def456-ghi789'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChatClickDto.prototype, "widgetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Domain where the click occurred',
        example: 'example.com'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChatClickDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User agent string',
        example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChatClickDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the click occurred',
        example: '2025-01-08T10:30:45.123Z'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChatClickDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador ID if user selected an ambassador',
        example: 'ambassador-abc123',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatClickDto.prototype, "ambassadorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador name if user selected an ambassador',
        example: 'John Doe',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatClickDto.prototype, "ambassadorName", void 0);
class ChatClickResponseDto {
}
exports.ChatClickResponseDto = ChatClickResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the click was recorded successfully',
        example: true
    }),
    __metadata("design:type", Boolean)
], ChatClickResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Chat click recorded successfully'
    }),
    __metadata("design:type", String)
], ChatClickResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Click ID if successfully recorded',
        example: 'click-abc123-def456',
        required: false
    }),
    __metadata("design:type", String)
], ChatClickResponseDto.prototype, "clickId", void 0);
class ChatClickAnswersDto {
}
exports.ChatClickAnswersDto = ChatClickAnswersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Click ID from the initial chat click',
        example: 'click-abc123-def456'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChatClickAnswersDto.prototype, "clickId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Answer to first question',
        example: 'I want to know about admission requirements',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatClickAnswersDto.prototype, "question1Answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Answer to second question',
        example: 'Yes, I need help with visa application',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatClickAnswersDto.prototype, "question2Answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador ID if user selected an ambassador',
        example: 'ambassador-abc123',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatClickAnswersDto.prototype, "ambassadorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ambassador name if user selected an ambassador',
        example: 'John Doe',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChatClickAnswersDto.prototype, "ambassadorName", void 0);
class ChatClickAnswersResponseDto {
}
exports.ChatClickAnswersResponseDto = ChatClickAnswersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the answers were saved successfully',
        example: true
    }),
    __metadata("design:type", Boolean)
], ChatClickAnswersResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Answers saved successfully'
    }),
    __metadata("design:type", String)
], ChatClickAnswersResponseDto.prototype, "message", void 0);
class ChatClickAnalyticsDto {
}
exports.ChatClickAnalyticsDto = ChatClickAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of chat clicks',
        example: 150
    }),
    __metadata("design:type", Number)
], ChatClickAnalyticsDto.prototype, "totalClicks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ALL individual chat click records with full details',
        example: [
            {
                id: 'click-123',
                domain: 'example.com',
                ipAddress: '192.168.1.1',
                country: 'United States',
                ambassadorId: 'ambassador-abc123',
                ambassadorName: 'John Doe',
                question1Answer: 'I want to know about admission requirements',
                question2Answer: 'Yes, I need help with visa',
                clickedAt: '2025-01-08T10:30:45.123Z',
                createdAt: '2025-01-08T10:30:45.123Z'
            },
            {
                id: 'click-124',
                domain: 'example.com',
                ipAddress: '192.168.1.2',
                country: 'Germany',
                ambassadorId: null,
                ambassadorName: null,
                question1Answer: null,
                question2Answer: null,
                clickedAt: '2025-01-08T10:25:30.456Z',
                createdAt: '2025-01-08T10:25:30.456Z'
            }
        ]
    }),
    __metadata("design:type", Array)
], ChatClickAnalyticsDto.prototype, "clicks", void 0);
//# sourceMappingURL=chat-click.dto.js.map