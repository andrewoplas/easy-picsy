import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ActivateEventDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
    message: 'MAC address must be in valid format (e.g., AA:BB:CC:DD:EE:FF)',
  })
  macAddress: string;
}
