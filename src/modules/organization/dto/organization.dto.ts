import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SelectOrganizationFrameworkDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  frameworkIds: string[];
}
