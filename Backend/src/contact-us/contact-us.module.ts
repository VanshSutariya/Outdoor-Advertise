import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ContactUs, ContactUsSchema } from './schema/contactUs.schema';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';
import { ContactEmailService } from './contactEmail.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ContactUs.name, schema: ContactUsSchema },
    ]),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService, ContactEmailService],
  exports: [ContactUsModule, ContactUsService, ContactEmailService],
})
export class ContactUsModule {}
