import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './common/auth/auth.module';
import { AmbassadorModule } from './modules/ambassador/ambassador.module';
import { UniversityModule } from './modules/university/university.module';
import { DeleteAccountModule } from './common/delete-account/delete-account.module';
import { HealthModule } from './common/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '3d' },
    }),
    AuthModule,
    AmbassadorModule,
    UniversityModule,
    DeleteAccountModule,
    HealthModule,
  ],
})
export class AppModule {}
