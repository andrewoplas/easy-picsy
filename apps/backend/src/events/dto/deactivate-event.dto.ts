import { IsString, IsOptional } from 'class-validator';

export class DeactivateEventDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
