import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermisosGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      this.router.navigate(['/auth/login']); // Redirigir al login si no está autenticado
      return false;
    }

    const parsedData = JSON.parse(userData);
    const pantallas = parsedData.pantallas;

    // Validar si el usuario tiene acceso a la URL completa
    const requestedUrl = state.url.startsWith('/') ? state.url : `/${state.url}`; // Asegura que la URL comience con '/'
    const tieneAcceso = pantallas.some(
      (modulo: any) =>
        modulo.pant_direccionURL &&
        requestedUrl.startsWith(modulo.pant_direccionURL)
    );

    if (!tieneAcceso) {
      this.router.navigate(['/auth/access']); // Redirigir a una página de acceso denegado
      return false;
    }

    return true; // Permitir acceso si tiene el Pantalla
  }
}
