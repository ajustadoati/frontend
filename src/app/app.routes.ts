import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout'),
        children: [
            {
                path: 'main',
                loadComponent: () => import('./home/main/main')
            },
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full'

            }
        ]
    }
];
