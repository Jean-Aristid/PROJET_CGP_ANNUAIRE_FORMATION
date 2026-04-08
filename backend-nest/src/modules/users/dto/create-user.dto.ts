import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAffectationDto } from './create-affectation.dto';

export class CreateUserDto {
  @IsString()
  login!: string;

  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsOptional()
  @IsEmail()
  email_institutionnel?: string | null;

  @IsOptional()
  @IsEmail()
  email_institutionnel_secondaire?: string | null;

  @IsOptional()
  @IsString()
  genre?: string | null;

  @IsOptional()
  @IsString()
  categorie?: string | null;

  @IsOptional()
  @IsString()
  telephone?: string | null;

  @IsOptional()
  @IsString()
  bureau?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAffectationDto)
  affectations?: CreateAffectationDto[];
}
