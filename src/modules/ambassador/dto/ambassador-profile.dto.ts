import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class SocialLinksDto {
  @ApiProperty({ description: 'Facebook profile URL', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ description: 'Instagram profile URL', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'TikTok profile URL', required: false })
  @IsOptional()
  @IsString()
  tiktok?: string;

  @ApiProperty({ description: 'X (Twitter) profile URL', required: false })
  @IsOptional()
  @IsString()
  x?: string;

  @ApiProperty({ description: 'LinkedIn profile URL', required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ description: 'YouTube channel URL', required: false })
  @IsOptional()
  @IsString()
  youtube?: string;

  @ApiProperty({ description: 'Following list', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  following?: string[];
}

export class CreateAmbassadorProfileDto {
  @ApiProperty({ description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Subject of study', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'University name', required: false })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiProperty({ description: 'Country of origin', required: false })
  @IsOptional()
  @IsString()
  countryOriginal?: string;

  @ApiProperty({ description: 'Current country', required: false })
  @IsOptional()
  @IsString()
  countryCurrent?: string;

  @ApiProperty({ description: 'Social media links', type: SocialLinksDto, required: false })
  @IsOptional()
  social?: SocialLinksDto;

  @ApiProperty({ description: 'Calendly booking link', required: false })
  @IsOptional()
  @IsString()
  calendlyLink?: string;

  @ApiProperty({ description: 'Written content status', required: false })
  @IsOptional()
  @IsString()
  writtenContent?: string;

  @ApiProperty({ description: 'Written content details', required: false })
  @IsOptional()
  @IsString()
  writtenDetails?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({ description: 'Gender', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Languages spoken', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({ description: 'Currently living country', required: false })
  @IsOptional()
  @IsString()
  currentlyLivingCountry?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Year left AP', required: false })
  @IsOptional()
  @IsNumber()
  leaveAPYear?: number;

  @ApiProperty({ description: 'Previous school name', required: false })
  @IsOptional()
  @IsString()
  previousSchoolName?: string;

  @ApiProperty({ description: 'Currently university student status', required: false })
  @IsOptional()
  @IsString()
  currentlyUniversityStudent?: string;

  @ApiProperty({ description: 'Current university name', required: false })
  @IsOptional()
  @IsString()
  currentUniversityName?: string;

  @ApiProperty({ description: 'Services offered', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiProperty({ description: 'Why studying this course', required: false })
  @IsOptional()
  @IsString()
  whyStudyingCourse?: string;

  @ApiProperty({ description: 'Skills and experience', required: false })
  @IsOptional()
  @IsString()
  skilsExperience?: string;

  @ApiProperty({ description: 'Hobbies and interests', required: false })
  @IsOptional()
  @IsString()
  hobbiesInterests?: string;

  @ApiProperty({ description: 'Caring causes', required: false })
  @IsOptional()
  @IsString()
  caringCauses?: string;

  @ApiProperty({ description: 'Accomplishments proud of', required: false })
  @IsOptional()
  @IsString()
  accomplishmentsProudOf?: string;

  @ApiProperty({ description: 'Answer to question 1', required: false })
  @IsOptional()
  @IsString()
  answerQ1?: string;

  @ApiProperty({ description: 'Answer to question 2', required: false })
  @IsOptional()
  @IsString()
  answerQ2?: string;

  @ApiProperty({ description: 'Answer to question 3', required: false })
  @IsOptional()
  @IsString()
  answerQ3?: string;

  @ApiProperty({ description: 'Answer to question 4', required: false })
  @IsOptional()
  @IsString()
  answerQ4?: string;

  @ApiProperty({ description: 'Question 1', required: false })
  @IsOptional()
  @IsString()
  question1?: string;

  @ApiProperty({ description: 'Question 2', required: false })
  @IsOptional()
  @IsString()
  question2?: string;

  @ApiProperty({ description: 'Question 3', required: false })
  @IsOptional()
  @IsString()
  question3?: string;

  @ApiProperty({ description: 'Is registered ambassador status', required: false })
  @IsOptional()
  @IsString()
  isRegisteredAmbassador?: string;

  @ApiProperty({ description: 'Profile image path', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class UpdateAmbassadorProfileDto extends CreateAmbassadorProfileDto {
  // No additional fields needed for update
}
