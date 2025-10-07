import { Module } from '@nestjs/common';
import { DeleteAccountController } from './delete-account.controller';
import { DeleteAccountService } from './delete-account.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DeleteAccountController],
  providers: [DeleteAccountService],
  exports: [DeleteAccountService],
})
export class DeleteAccountModule {}
