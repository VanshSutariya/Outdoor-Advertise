import { Module } from '@nestjs/common';
import { PosterDetailsController } from './poster-details.controller';
import { PosterDetailsService } from './poster-details.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posters, PostersSchema } from './schemas/posters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posters.name, schema: PostersSchema }]),
  ],
  controllers: [PosterDetailsController],
  providers: [PosterDetailsService],
})
export class PosterDetailsModule {}
