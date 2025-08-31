import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Length, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string = 'PHP';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}