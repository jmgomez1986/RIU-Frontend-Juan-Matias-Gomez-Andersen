import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroGridCard } from './hero-grid-card';
import { Hero } from '../../../interfaces/heroes.interface';

// Se crea el Mock del heroe cpmo una arrow function, para despues si es necesario, en otros test,
// usarla para sobreescribir algun atributo
// Ejemplo: fixture.componentRef.setInput('hero', createMockHero({ name: 'Nuevo nombre' }));
const createMockHero = (overrides: Partial<Hero> = {}): Hero => ({
  id: '1',
  name: 'Clark Kent',
  alias: 'Superman',
  powers: ['Vuelo', 'Super fuerza', 'Visión de calor'],
  description: 'Descripción de prueba',
  team: 'Liga de la Justicia',
  image: 'superman.jpg',
  status: 'Active',
  category: 'Heroe',
  universe: 'DC',
  ...overrides,
});

describe('HeroGridCard', () => {
  let component: HeroGridCard;
  let fixture: ComponentFixture<HeroGridCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroGridCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroGridCard);
    component = fixture.componentInstance;

    // El input "hero" es requerido se setea antes usando el mock generado por la función createMockHero
    fixture.componentRef.setInput('hero', createMockHero());

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display status with other backgroud if status is  not "Active"', () => {
    // Se setea el input "hero" con un status diferente a "Active"
    fixture.componentRef.setInput('hero', createMockHero({ status: 'Inactive' }));
    fixture.detectChanges();

    const statusElement = fixture.nativeElement.querySelector('.bg-red-500');
    expect(statusElement).toBeTruthy();
  });

  it('should display 3 chiips of powers ', () => {
    const chips = fixture.nativeElement.querySelectorAll('mat-chip') as NodeListOf<Element>;
    const chipTexts = Array.from(chips).map((chip) => chip.textContent?.trim());

    expect(chipTexts).toContain('Vuelo');
    expect(chipTexts).toContain('Super fuerza');
    expect(chipTexts).toContain('Visión de calor');
  });

  it('should display only 3 chips of powers and display other chip with text "2 más"', () => {
    // Se setea el input "hero" con más de 3 powers
    fixture.componentRef.setInput(
      'hero',
      createMockHero({
        powers: ['Vuelo', 'Super fuerza', 'Visión de calor', 'Regeneración', 'Invisibilidad'],
      }),
    );
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll('mat-chip') as NodeListOf<Element>;
    const chipTexts = Array.from(chips).map((chip) => chip.textContent?.trim());

    expect(chipTexts).toContain('Vuelo');
    expect(chipTexts).toContain('Super fuerza');
    expect(chipTexts).toContain('Visión de calor');
    expect(chipTexts).toContain('2 más');
    expect(chipTexts).not.toContain('Regeneración');
    expect(chipTexts).not.toContain('Invisibilidad');
  });
});
