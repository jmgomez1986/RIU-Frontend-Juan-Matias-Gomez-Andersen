import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  Filters,
  Hero,
  HeroesResponsePaginated,
  NewHeroResponse,
} from '../interfaces/heroes.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private http = inject(HttpClient);
  private apiUrl = '/api/heroes';

  // Devuelve todos los heroes de la db
  getHeroes(): Observable<Hero[]> {
    return this.http
      .get<Hero[]>(this.apiUrl)
      .pipe(
        map((heroes) => heroes.map((hero) => ({ ...hero, image: this.resolveImage(hero.image) }))),
      );
  }

  /**
   * Consulta paginada de héroes aplicando el filtro por coincidencia parcial en el NOMBRE (y opcionalmente por ALIAS).
   * La lógica de búsqueda vive acá, no en el mock
   */
  getHeroesPaginated(
    page: number,
    itemsPerPage: number,
    query?: Filters,
  ): Observable<HeroesResponsePaginated> {
    const nameQuery = (query?.name ?? '').trim().toLocaleLowerCase();
    const aliasQuery = (query?.alias ?? '').trim().toLocaleLowerCase();

    return this.getHeroes().pipe(
      map((heroes) => {
        const filtered = heroes.filter((hero) => {
          const matchesName = !nameQuery || hero.name.toLocaleLowerCase().includes(nameQuery);
          const matchesAlias = !aliasQuery || hero.alias.toLocaleLowerCase().includes(aliasQuery);
          return matchesName && matchesAlias;
        });

        const pages = Math.ceil(filtered.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const data = filtered.slice(start, start + itemsPerPage);

        return {
          first: 1,
          prev: page > 1 ? page - 1 : null,
          next: page < pages ? page + 1 : null,
          last: pages,
          pages,
          items: filtered.length,
          data,
        };
      }),
    );
  }

  // Obtener un heroe por id
  getHeroById(heroId: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${heroId}`);
  }

  // Grabar un nuevo heroe en la db
  addNewHero(newHero: Hero): Observable<NewHeroResponse> {
    return this.http.post<NewHeroResponse>(this.apiUrl, newHero);
  }

  // Editar un heroe por un id dado
  editHero(heroId: string, hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/${heroId}`, hero);
  }

  // Eliminar un heroe de la db por un id dado
  deleteHero(heroId: string): Observable<Hero> {
    return this.http.delete<Hero>(`${this.apiUrl}/${heroId}`);
  }

  // Resuelve la URL de la imagen para el <img>:
  // - Si ya es un data URL (imagen subida en base64), se usa tal cual.
  // - Si es un nombre de archivo (ej: "1.jpeg"), se antepone la carpeta de imágenes.
  private resolveImage(image: string): string {
    return image.startsWith('data:') ? image : `images/${image}`;
  }
}
