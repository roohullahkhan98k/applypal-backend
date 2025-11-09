"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartTransformPipe = void 0;
const common_1 = require("@nestjs/common");
let MultipartTransformPipe = class MultipartTransformPipe {
    transform(value, metadata) {
        if (metadata.type === 'body' && value) {
            const transformed = { ...value };
            if (transformed.social && typeof transformed.social === 'string') {
                try {
                    transformed.social = JSON.parse(transformed.social);
                }
                catch (error) {
                    throw new common_1.BadRequestException('Invalid social field format');
                }
            }
            if (transformed.languages && typeof transformed.languages === 'string') {
                try {
                    transformed.languages = JSON.parse(transformed.languages);
                }
                catch (error) {
                    throw new common_1.BadRequestException('Invalid languages field format');
                }
            }
            if (transformed.services && typeof transformed.services === 'string') {
                try {
                    transformed.services = JSON.parse(transformed.services);
                }
                catch (error) {
                    throw new common_1.BadRequestException('Invalid services field format');
                }
            }
            if (transformed.leaveAPYear && typeof transformed.leaveAPYear === 'string') {
                const num = parseInt(transformed.leaveAPYear, 10);
                if (isNaN(num)) {
                    throw new common_1.BadRequestException('leaveAPYear must be a valid number');
                }
                transformed.leaveAPYear = num;
            }
            return transformed;
        }
        return value;
    }
};
exports.MultipartTransformPipe = MultipartTransformPipe;
exports.MultipartTransformPipe = MultipartTransformPipe = __decorate([
    (0, common_1.Injectable)()
], MultipartTransformPipe);
//# sourceMappingURL=multipart-transform.pipe.js.map