import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';
import { Anime } from './entities/anime.entity.js';

@Injectable()
export class AnimeService {
  // Datos conservados en memoria
  private animes: Anime[] = [
    {
      id: '1',
      title: 'Jujutsu Kaisen',
      studio: 'MAPPA',
      episodes: 47,
      status: 'Completed',
      imageUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    },
    {
      id: '2',
      title: 'Solo Leveling',
      studio: 'A-1 Pictures',
      episodes: 12,
      status: 'Ongoing',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTEzMjk3N2MtOGE5Ni00ZTgwLWFmZWItZjlkYjRhZmQ2YzdkXkEyXkFqcGdeQXVyMTE0MzQwNzEz._V1_.jpg',
    },
    {
      id: '3',
      title: 'One Piece',
      studio: 'Toei Animation',
      episodes: 1100,
      status: 'Ongoing',
      imageUrl: '/covers/One Piece.jpg',
    },
    {
      id: '4',
      title: 'Sono Bisque Doll wa Koi wo Suru',
      studio: 'CloverWorks',
      episodes: 12,
      status: 'Completed',
      imageUrl: '/covers/Sono Bisque Doll.jpg',
    },
    {
      id: '5',
      title: 'Marvel Anime: Iron Man',
      studio: 'Madhouse',
      episodes: 12,
      status: 'Completed',
      imageUrl: '/covers/Iron_Man_Anime.jpg',
    },
    {
      id: '6',
      title: 'Kaoru Hana wa Rin to Saku',
      studio: 'CloverWorks',
      episodes: 12,
      status: 'Ongoing',
      imageUrl: '/covers/Kaoru Hana.jpg',
    },
    {
      id: '7',
      title: 'You and I Are Polar Opposites',
      studio: 'Shueisha',
      episodes: 34,
      status: 'Ongoing',
      imageUrl: '/covers/images.jpg',
    },
    {
      id: '8',
      title: 'Otaku ni Yasashii Gal wa Inai!?',
      studio: 'Comic Zenon',
      episodes: 30,
      status: 'Ongoing',
      imageUrl: '/covers/Ota gal.jpg',
    },
    {
      id: '9',
      title: 'Watari-kun no xx ga Houkai Sunzen',
      studio: 'Kodansha',
      episodes: 80,
      status: 'Completed',
      imageUrl: '/covers/watari kun is about to collapse.jpg',
    },
    {
      id: '10',
      title: 'I made Friends with the Second Prettiest Girl in my Class',
      studio: 'Kadokawa',
      episodes: 12,
      status: 'Ongoing',
      imageUrl: '/covers/I made Friends with the Second Prettiest Girl in my Class.jpg',
    }
  ];

  findAll(): Anime[] {
    return this.animes;
  }

  findOne(id: string): Anime {
    const anime = this.animes.find((a) => a.id === id);
    if (!anime) {
      // Requisito: Usar excepciones estándar
      throw new NotFoundException(`Anime con ID ${id} no encontrado`);
    }
    return anime;
  }

  create(createAnimeDto: CreateAnimeDto): Anime {
    const exists = this.animes.some((a) => a.title.toLowerCase() === createAnimeDto.title.toLowerCase());
    if (exists) {
      // Requisito: Código 409 Conflict
      throw new ConflictException(`El anime '${createAnimeDto.title}' ya existe`);
    }

    const newAnime: Anime = {
      id: Date.now().toString(),
      ...createAnimeDto,
    };
    this.animes.push(newAnime);
    return newAnime;
  }

  update(id: string, updateAnimeDto: UpdateAnimeDto): Anime {
    const index = this.animes.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Anime con ID ${id} no encontrado`);
    }

    if (updateAnimeDto.title) {
      const newTitle = updateAnimeDto.title.toLowerCase();
      const exists = this.animes.some((a) => a.id !== id && a.title.toLowerCase() === newTitle);
      if (exists) {
        throw new ConflictException(`Ya existe otro anime llamado '${updateAnimeDto.title}'`);
      }
    }

    this.animes[index] = { ...this.animes[index], ...updateAnimeDto };
    return this.animes[index];
  }

  remove(id: string): void {
    const index = this.animes.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Anime con ID ${id} no encontrado`);
    }
    this.animes.splice(index, 1);
  }
}
