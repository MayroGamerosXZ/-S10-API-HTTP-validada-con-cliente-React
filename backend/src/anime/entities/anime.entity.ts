export class Anime {
  id: string;
  title: string;
  studio: string;
  episodes: number;
  status: 'Ongoing' | 'Completed';
  imageUrl?: string;
}
