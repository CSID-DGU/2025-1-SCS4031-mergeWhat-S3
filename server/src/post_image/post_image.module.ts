import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './post_image.entity';
import { PostImageService } from './post_image.service';
import { PostImageController } from './post_image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  controllers: [PostImageController],
  providers: [PostImageService],
  exports: [PostImageService],
})
export class PostImageModule {}
