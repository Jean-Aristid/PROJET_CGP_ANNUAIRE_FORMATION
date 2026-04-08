import { IsOptional, IsString } from 'class-validator';

export class OrganigrammeExportQueryDto {
  @IsOptional()
  @IsString()
  format?: 'PDF' | 'CSV' | 'JSON' | 'SVG';

  @IsOptional()
  @IsString()
  view?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  entiteIds?: string;
}
