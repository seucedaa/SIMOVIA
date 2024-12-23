import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'input', data: { breadcrumb: 'Input' }, loadChildren: () => import('./input/inputdemo.module').then(m => m.InputDemoModule) },
        { path: 'overlay', data: { breadcrumb: 'Overlay' }, loadChildren: () => import('./overlays/overlaysdemo.module').then(m => m.OverlaysDemoModule) },
        { path: 'tree', data: { breadcrumb: 'Tree' }, loadChildren: () => import('./tree/treedemo.module').then(m => m.TreeDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
