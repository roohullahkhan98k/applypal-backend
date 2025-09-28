import { Module } from '@nestjs/common';
import { AmbassadorController } from './ambassador.controller';
import { AuthModule } from '../../common/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AmbassadorController],
})
export class AmbassadorModule {}
