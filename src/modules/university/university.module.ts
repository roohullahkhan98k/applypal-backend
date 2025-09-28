import { Module } from '@nestjs/common';
import { UniversityController } from './university.controller';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UniversityController],
})
export class UniversityModule {}
