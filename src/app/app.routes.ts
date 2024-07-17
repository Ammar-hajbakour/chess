import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'game/:id',
    loadComponent: () => import('./pages/game-page/game-page.component').then(m => m),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game-page/game-page.component').then(m => m),
  }
];
