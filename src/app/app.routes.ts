import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'heroes',
        loadComponent: () => import('./pages/heroes-page/heroes-page'),
      },
      {
        path: 'new-hero',
        loadComponent: () => import('./pages/new-hero-page/new-hero-page'),
        children: [
          {
            path: '',
            loadComponent: () => import('./heroes/components/new-hero/new-hero'),
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'heroes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '*',
    redirectTo: '',
    pathMatch: 'full',
  },
];
