import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Hero, HeroesResponsePaginated, NewHeroResponse } from '../interfaces/heroes.interface';

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
  // Devuelve los heroes de la db paginados
  getHeroPaginated(page: number, itemsPerPage: number): Observable<HeroesResponsePaginated> {
    const queryParams: HttpParams = new HttpParams()
      .set('_page', page.toString())
      .set('_per_page', itemsPerPage.toString());
    return this.http.get<HeroesResponsePaginated>(`${this.apiUrl}?${queryParams}`).pipe(
      map((resp) => ({
        ...resp,
        data: resp.data.map((hero) => ({ ...hero, image: this.resolveImage(hero.image) })),
      })),
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
