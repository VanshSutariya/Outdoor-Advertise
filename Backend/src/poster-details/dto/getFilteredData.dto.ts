import { IsOptional, IsString } from 'class-validator';

export class FilteredDto {
  @IsString()
  @IsOptional()
  city?: string;
}
