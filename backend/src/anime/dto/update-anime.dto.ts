import { PartialType } from '@nestjs/swagger';
import { CreateAnimeDto } from './create-anime.dto.js';

export class UpdateAnimeDto extends PartialType(CreateAnimeDto) {}
