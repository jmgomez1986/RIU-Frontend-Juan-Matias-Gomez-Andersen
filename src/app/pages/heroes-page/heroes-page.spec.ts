import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import HeroesPage from './heroes-page';
import { HeroesResponsePaginated } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes';

// Se mockea HeroesService por un fake que emite al instante (igual que heroes-grid.spec.ts),
// para que el HeroesGrid real se renderice sin tocar HTTP y el template quede cubierto.
// NO de usa TestBed.overrideComponent porque hace que el HTML no se renderice y no tenga cobertura
const fakePaginatedResponse: HeroesResponsePaginated = {
  first: 1,
  prev: 1,
  next: 2,
  last: 1,
  pages: 1,
  items: 0,
  data: [],
};

describe('HeroesPage', () => {
  let component: HeroesPage;
  let fixture: ComponentFixture<HeroesPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesPage],
      providers: [
        provideRouter([]),
        { provide: HeroesService, useValue: { getHeroPaginated: () => of(fakePaginatedResponse) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate with "/new-hero" when navigateToNewHero is called', () => {
    // Se crea un espia de router.navigate para verificar que se llame con el argumento correcto
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.navigateToNewHero();
    expect(navigateSpy).toHaveBeenCalledWith(['/new-hero'], { state: { mode: 'create' } });
  });

  it('should call router.navigate with "/new-hero" when the button is clicked', () => {
    // Se crea un espia de router.navigate para verificar que se llame con el argumento correcto
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    // Renderiza el template para poder acceder al DOM.
    fixture.detectChanges();
    // Busca el botón en el template y verifica que exista
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    // Dispara el evento (click) bindeado a navigateToNewHero().
    button.triggerEventHandler('click', null);

    expect(navigateSpy).toHaveBeenCalledWith(['/new-hero'], { state: { mode: 'create' } });
  });
});
