import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filters } from './filters';

describe('Filters', () => {
  let component: Filters;
  let fixture: ComponentFixture<Filters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filters],
    }).compileComponents();

    fixture = TestBed.createComponent(Filters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('valueChanges (filtro por nombre)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('no emite si el control es valido pero el query queda 1-2 chars tras el trim', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.nameFilterApplied, 'emit');

      component.nameFilter.setValue(' ab ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });

    it('emite con trim cuando hay >= 3 chars', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.nameFilterApplied, 'emit');

      component.nameFilter.setValue('  super  ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).toHaveBeenCalledWith('super');
    });

    it('no emite cuando el control es invalido (< 3 chars)', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.nameFilterApplied, 'emit');

      component.nameFilter.setValue('ab');
      expect(component.nameFilter.invalid).toBe(true);
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });
  });

  describe('valueChanges (filtro por alias)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('no emite si el control es valido pero el query queda 1-2 chars tras el trim', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.aliasFilterApplied, 'emit');

      component.aliasFilter.setValue(' ab ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });

    it('emite con trim cuando hay >= 3 chars', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.aliasFilterApplied, 'emit');

      component.aliasFilter.setValue('  super  ');
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).toHaveBeenCalledWith('super');
    });

    it('no emite cuando el control es invalido (< 3 chars)', async () => {
      vi.useFakeTimers();
      const emit = vi.spyOn(component.aliasFilterApplied, 'emit');

      component.aliasFilter.setValue('ab');
      expect(component.aliasFilter.invalid).toBe(true);
      await vi.advanceTimersByTimeAsync(1000);

      expect(emit).not.toHaveBeenCalled();
    });
  });
});