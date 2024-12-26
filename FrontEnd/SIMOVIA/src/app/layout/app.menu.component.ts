import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.generarMenuDinamico();

    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      this.router.navigate(['/auth/login']);
    }
  }

  generarMenuDinamico() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      return;
    }

    const parsedData = JSON.parse(userData);
    const pantallas = parsedData.pantallas;

    // Mapeo de íconos para las pantallas
    const iconMap: { [key: string]: string } = {
      'Inicio': 'pi pi-fw pi-home',
      'Colaboradores': 'pi pi-fw pi-id-card',
      'Reporte': 'pi pi-fw pi-file',
      'Viajes': 'pi pi-fw pi-briefcase',
    };

    // Función para obtener el ícono basado en el nombre
    const getIcon = (nombre: string | null) =>
      nombre && iconMap[nombre] ? iconMap[nombre] : 'pi pi-fw pi-folder';

    // Crear elementos del menú dinámicamente
    const elementosMenu = pantallas.map((pantalla: any) => ({
      label: pantalla.pant_Descripcion,
      icon: getIcon(pantalla.pant_Descripcion),
      routerLink: [pantalla.pant_direccionURL],
      routerLinkActive: 'active-route',
      routerLinkActiveOptions: { exact: false },
    }));

    // Pantallas del menú final
    this.model = [
      {
        items: [
          { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/SIMOVIA'] },
        ],
      },
      ...elementosMenu.map((pantalla: any) => ({
        items: [pantalla],
      })),
    ];
  }
}