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
exports.UpdateAmbassadorProfileDto = exports.CreateAmbassadorProfileDto = exports.SocialLinksDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SocialLinksDto {
}
exports.SocialLinksDto = SocialLinksDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Facebook profile URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Instagram profile URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'TikTok profile URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "tiktok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'X (Twitter) profile URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'LinkedIn profile URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "linkedin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'YouTube channel URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "youtube", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Following list', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SocialLinksDto.prototype, "following", void 0);
class CreateAmbassadorProfileDto {
}
exports.CreateAmbassadorProfileDto = CreateAmbassadorProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject of study', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'University name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "university", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country of origin', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "countryOriginal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current country', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "countryCurrent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Social media links', type: SocialLinksDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", SocialLinksDto)
], CreateAmbassadorProfileDto.prototype, "social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Calendly booking link', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "calendlyLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Written content status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "writtenContent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Written content details', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "writtenDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gender', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Languages spoken', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAmbassadorProfileDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currently living country', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "currentlyLivingCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Year left AP', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAmbassadorProfileDto.prototype, "leaveAPYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Previous school name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "previousSchoolName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currently university student status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "currentlyUniversityStudent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current university name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "currentUniversityName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Services offered', type: [String], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAmbassadorProfileDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Why studying this course', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "whyStudyingCourse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Skills and experience', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "skilsExperience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hobbies and interests', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "hobbiesInterests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caring causes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "caringCauses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Accomplishments proud of', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "accomplishmentsProudOf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Answer to question 1', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "answerQ1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Answer to question 2', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "answerQ2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Answer to question 3', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "answerQ3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Answer to question 4', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "answerQ4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question 1', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "question1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question 2', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "question2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question 3', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "question3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is registered ambassador status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "isRegisteredAmbassador", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Profile image path', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmbassadorProfileDto.prototype, "profileImage", void 0);
class UpdateAmbassadorProfileDto extends CreateAmbassadorProfileDto {
}
exports.UpdateAmbassadorProfileDto = UpdateAmbassadorProfileDto;
//# sourceMappingURL=ambassador-profile.dto.js.map