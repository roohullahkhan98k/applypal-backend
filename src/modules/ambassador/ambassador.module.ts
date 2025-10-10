import { Module } from '@nestjs/common';
import { AmbassadorController } from './ambassador.controller';
import { AmbassadorService } from './ambassador.service';
import { DatabaseModule } from '../../database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/ambassador-profiles',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `ambassador-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024, 
      },
    }),
  ],
  controllers: [AmbassadorController],
  providers: [AmbassadorService],
  exports: [AmbassadorService],
})
export class AmbassadorModule {}
