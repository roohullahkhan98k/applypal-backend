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
exports.WidgetResponseDto = exports.WidgetConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class WidgetConfigDto {
}
exports.WidgetConfigDto = WidgetConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Selected icons array', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], WidgetConfigDto.prototype, "selectedIcons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Icon inputs configuration - dynamic object with icon names as keys',
        type: 'object',
        required: false,
        example: {
            "Chat": { "label": "Chat Support", "url": "https://university.com/chat" },
            "Home": { "label": "Homepage", "url": "https://university.com" }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WidgetConfigDto.prototype, "iconInputs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Selected color for the widget', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetConfigDto.prototype, "selectedColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'University ID or identifier', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WidgetConfigDto.prototype, "universityId", void 0);
class WidgetResponseDto {
}
exports.WidgetResponseDto = WidgetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Generated iframe HTML code (backward compatibility)' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "iframeCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Iframe codes for different platforms and frameworks',
        example: {
            html: '<iframe src="..." width="200" height="300">...</iframe>',
            react: '<iframe src="..." frameBorder="0" style={{...}} />',
            vue: '<iframe :src="..." :style="{...}">...</iframe>',
            angular: '<iframe [src]="..." [style]="{...}">...</iframe>',
            wordpress: '<!-- WordPress comment --> <iframe>...</iframe>',
            shopify: '<!-- Shopify comment --> <iframe>...</iframe>'
        }
    }),
    __metadata("design:type", Object)
], WidgetResponseDto.prototype, "iframeFormats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget preview URL' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "previewUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Widget ID for future reference' }),
    __metadata("design:type", String)
], WidgetResponseDto.prototype, "widgetId", void 0);
//# sourceMappingURL=widget-config.dto.js.map