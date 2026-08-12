import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import EditHeroPage from './edit-hero-page';
import { Hero } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes';

const mockHero: Hero = {
  id: '1',
  name: 'Clark Kent',
  alias: 'Superman',
  powers: ['Vuelo'],
  description: 'Descripción de prueba',
  team: 'Liga de la Justicia',
  image: 'superman.jpg',
  status: 'Active',
  category: 'Heroe',
  universe: 'DC',
};

describe('EditHeroPage', () => {
  let component: EditHeroPage;
  let fixture: ComponentFixture<EditHeroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHeroPage],
      providers: [
        provideRouter([]),
        {
          provide: HeroesService,
          useValue: { getHeroById: () => of(mockHero) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeroPage);
    fixture.componentRef.setInput('heroId', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
