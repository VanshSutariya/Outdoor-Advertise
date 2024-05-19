import { Body, Controller, Post } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/createContact.dto';

@Controller('contactUs')
export class ContactUsController {
  constructor(private contactUsService: ContactUsService) {}

  @Post()
  async createContact(@Body() contactUsDto: CreateContactUsDto) {
    return await this.contactUsService.createContactUs(contactUsDto);
  }
}
