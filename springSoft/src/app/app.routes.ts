import { Routes } from '@angular/router';
import { AppUrlEnum } from './core/const/route.enums';

export const routes: Routes = [
    {
        path: '',
        redirectTo: `/${AppUrlEnum.USER}/${AppUrlEnum.LIST}`,
        pathMatch: 'full',
    },
    {
        path: `${AppUrlEnum.USER}/${AppUrlEnum.LIST}`,
        loadComponent: () => import('./feature/user-list/user-list.component').then(m => m.UserListComponent),
    },
   
    { path: '**', pathMatch: 'full', redirectTo: `/${AppUrlEnum.USER}/${AppUrlEnum.LIST}` },
];