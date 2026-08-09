import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Hero, HeroesResponsePaginated } from '../interfaces/heroes.interface';

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
      .pipe(map((heroes) => heroes.map((hero) => ({ ...hero, image: `images/${hero.image}` }))));
  }

  // Devuelve los heroes de la db paginados
  getHeroPaginated(page: number, itemsPerPage: number): Observable<HeroesResponsePaginated> {
    const queryParams: HttpParams = new HttpParams()
      .set('_page', page.toString())
      .set('_per_page', itemsPerPage.toString());
    return this.http.get<HeroesResponsePaginated>(`${this.apiUrl}?${queryParams}`).pipe(
      map((resp) => ({
        ...resp,
        data: resp.data.map((hero) => ({ ...hero, image: `images/${hero.image}` })),
      })),
    );
  }
}
