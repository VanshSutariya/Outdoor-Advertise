import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

// Define an enum for the status
export enum UserRoleChangeStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(UserRoleChangeStatus)
  status: UserRoleChangeStatus;
}
