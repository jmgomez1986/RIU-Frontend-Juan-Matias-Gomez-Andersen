import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Hero, HeroesResponsePaginated, NewHeroRespone } from '../interfaces/heroes.interface';

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
      .pipe(map((heroes) => heroes.map((hero) => ({ ...hero, image: this.resolveImage(hero.image) }))));
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
  // Resuelve la URL de la imagen para el <img>:
  // - Si ya es un data URL (imagen subida en base64), se usa tal cual.
  // - Si es un nombre de archivo (ej: "1.jpeg"), se antepone la carpeta de imágenes.
  private resolveImage(image: string): string {
    return image.startsWith('data:') ? image : `images/${image}`;
  }
  // Grabar un nuevo heroe en la db
  // Se envía el objeto (NO JSON.stringify) para que Angular agregue el header
  // "Content-Type: application/json" y json-server lo parsee correctamente.
  addNewHero(newHero: Hero): Observable<NewHeroRespone> {
    return this.http.post<NewHeroRespone>(this.apiUrl, newHero);
  }
}
