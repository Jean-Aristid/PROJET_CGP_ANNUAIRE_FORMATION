import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

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
}
