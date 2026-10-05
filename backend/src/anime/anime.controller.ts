import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnimeService } from './anime.service.js';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';

@ApiTags('Animes')
@Controller('animes')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201 Created
  @ApiOperation({ summary: 'Crear un nuevo anime en la colección' })
  @ApiResponse({ status: 201, description: 'Recurso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Bad Request: Datos inválidos o propiedades desconocidas.' })
  @ApiResponse({ status: 409, description: 'Conflict: El anime ya existe.' })
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK) // 200 OK
  @ApiOperation({ summary: 'Obtener la colección completa de animes' })
  @ApiResponse({ status: 200, description: 'Lista retornada.' })
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK) // 200 OK
  @ApiOperation({ summary: 'Obtener el detalle de un anime por ID' })
  @ApiParam({ name: 'id', description: 'El ID único del anime' })
  @ApiResponse({ status: 200, description: 'Detalle del anime.' })
  @ApiResponse({ status: 404, description: 'Not Found: El anime no existe.' })
  findOne(@Param('id') id: string) {
    return this.animeService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK) // 200 OK
  @ApiOperation({ summary: 'Actualizar parcialmente un anime existente' })
  @ApiResponse({ status: 200, description: 'Anime actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Bad Request: Tipos de datos incorrectos.' })
  @ApiResponse({ status: 404, description: 'Not Found: El anime a actualizar no existe.' })
  @ApiResponse({ status: 409, description: 'Conflict: El nuevo título ya está registrado.' })
  update(@Param('id') id: string, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  @ApiOperation({ summary: 'Eliminar un anime de la colección' })
  @ApiResponse({ status: 204, description: 'Recurso eliminado correctamente. No retorna contenido.' })
  @ApiResponse({ status: 404, description: 'Not Found: El anime a eliminar no existe.' })
  remove(@Param('id') id: string) {
    this.animeService.remove(id);
  }
}
