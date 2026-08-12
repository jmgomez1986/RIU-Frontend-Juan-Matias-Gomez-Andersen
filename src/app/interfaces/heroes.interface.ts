export interface HeroesGridRequest {
  page: number;
  size: number;
}

export interface HeroesResponsePaginated {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Hero[];
}
export interface Hero {
  id: string;
  name: string;
  alias: string;
  powers: string[];
  description: string;
  team: string;
  image: string;
  status: string;
  category: string;
  universe: string;
}

export interface NewHeroResponse {
  res: Hero;
}
