import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class MultipartTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value) {
      // Transform string values to appropriate types
      const transformed = { ...value };

      // Parse JSON fields
      if (transformed.social && typeof transformed.social === 'string') {
        try {
          transformed.social = JSON.parse(transformed.social);
        } catch (error) {
          throw new BadRequestException('Invalid social field format');
        }
      }

      // Parse array fields
      if (transformed.languages && typeof transformed.languages === 'string') {
        try {
          transformed.languages = JSON.parse(transformed.languages);
        } catch (error) {
          throw new BadRequestException('Invalid languages field format');
        }
      }

      if (transformed.services && typeof transformed.services === 'string') {
        try {
          transformed.services = JSON.parse(transformed.services);
        } catch (error) {
          throw new BadRequestException('Invalid services field format');
        }
      }

      // Parse number fields
      if (transformed.leaveAPYear && typeof transformed.leaveAPYear === 'string') {
        const num = parseInt(transformed.leaveAPYear, 10);
        if (isNaN(num)) {
          throw new BadRequestException('leaveAPYear must be a valid number');
        }
        transformed.leaveAPYear = num;
      }

      return transformed;
    }
    return value;
  }
}
