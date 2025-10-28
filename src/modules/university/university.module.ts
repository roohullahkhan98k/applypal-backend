import { Module } from '@nestjs/common';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { ChatClickService } from './services/chat-click.service';
import { GeolocationService } from './services/geolocation.service';
import { EmailService } from './services/email.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UniversityController],
  providers: [UniversityService, ChatClickService, GeolocationService, EmailService],
  exports: [UniversityService, ChatClickService, GeolocationService, EmailService],
})
export class UniversityModule {}
