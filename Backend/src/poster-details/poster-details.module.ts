import { Module } from '@nestjs/common';
import { PosterDetailsController } from './poster-details.controller';
import { PosterDetailsService } from './poster-details.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posters, PostersSchema } from './schemas/posters.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RoleChangeGateway } from 'src/gateway/role-change-gateway';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Posters.name, schema: PostersSchema }]),
  ],
  controllers: [PosterDetailsController],
  providers: [PosterDetailsService, RoleChangeGateway],
  exports: [PosterDetailsModule, RoleChangeGateway, PosterDetailsService],
})
export class PosterDetailsModule {}
