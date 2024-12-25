import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                items: [
                    {
                        label: 'Viajes',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/viaje/viaje'],
                        routerLinkActive: 'active-route',
                        routerLinkActiveOptions: { exact: false },
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Generales',
                        icon: 'pi pi-images',
                        items: [
                            {
                                label: 'Colaboradores',
                                icon: 'pi pi-fw pi-id-card',
                                routerLink: ['/general/colaborador'],
                                routerLinkActive: 'active-route',
                                routerLinkActiveOptions: { exact: false },
                            }
                        ]
                    }
                    
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                ]
            },
        ];
    }
}
