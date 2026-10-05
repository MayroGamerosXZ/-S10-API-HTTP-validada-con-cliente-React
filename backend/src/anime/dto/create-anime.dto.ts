import { IsString, IsInt, IsNotEmpty, Min, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AnimeStatus {
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
}

export class CreateAnimeDto {
  @ApiProperty({ example: 'Shingeki no Kyojin', description: 'Título del anime' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'MAPPA', description: 'Estudio de animación' })
  @IsString()
  @IsNotEmpty()
  studio: string;

  @ApiProperty({ example: 24, description: 'Número de episodios' })
  @IsInt()
  @Min(1)
  episodes: number;

  @ApiProperty({ enum: AnimeStatus, example: AnimeStatus.COMPLETED })
  @IsEnum(AnimeStatus)
  status: AnimeStatus;

  @ApiPropertyOptional({ example: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
