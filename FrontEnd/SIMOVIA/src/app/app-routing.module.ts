import { Route, RouterModule, Routes } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { Children } from 'preact/compat';
import { PermisosGuard } from './guards/permisos.guard';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '', redirectTo: 'auth', pathMatch: 'full',
            },
            {
                path: 'auth',
                loadChildren: () => 
                    import('./demo/components/auth/auth.module').then(
                        (m) => m.AuthModule
                    ), 
            },
        ]

    },
    {
        path: 'SIMOVIA',
        component: AppLayoutComponent,
        children: [
            { path: '',  data: { breadcrumb: 'Inicio' }, loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'general', canActivate: [PermisosGuard],  data: { breadcrumb: 'General' }, loadChildren: () => import('./demo/components/componentsgeneral/general.module').then(m => m.GeneralModule) },
            { path: 'viaje', canActivate: [PermisosGuard],  data: { breadcrumb: 'Viaje' }, loadChildren: () => import('./demo/components/componentsviaje/viaje.module').then(m => m.ViajeModule) }
        ]
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})



export class AppRoutingModule {}