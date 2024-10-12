import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContactUs } from './schema/contactUs.schema';
import { Model } from 'mongoose';
import { CreateContactUsDto } from './dto/createContact.dto';
import { ContactEmailService } from './contactEmail.service';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name) private contactUsModel: Model<ContactUs>,
    private contactUsEmail: ContactEmailService,
  ) {}

  async createContactUs(contactusDto: CreateContactUsDto) {
    try {
      const newContact = await this.contactUsModel.create(contactusDto);
      if (!newContact) throw new HttpException('Contact is not Created.', 404);

      const resEmail = await this.contactUsEmail.sendEmail(
        newContact.email,
        newContact.subject,
        newContact.description,
      );

      return { resEmail, newContact };
    } catch (error) {
      throw new HttpException('Message Not Send.Try Again.', 400);
    }
  }
}
