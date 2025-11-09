import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class MultipartTransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
