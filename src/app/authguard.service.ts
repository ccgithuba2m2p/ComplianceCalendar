import { Injectable, NgZone, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, @Inject(SESSION_STORAGE) private storage: WebStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(this.storage.get('user')){
            return true;
        }
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}