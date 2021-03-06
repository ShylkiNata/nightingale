﻿import { Component } from "@angular/core";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd } from "@angular/router";
import { AuthenticationService } from "../../../core/services";

@Component({
    selector: 'navbar',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent {
    faSignOutAlt = faSignOutAlt;
    isAuthorized: boolean = false;
    activeRoute: String = null;

    constructor(private router: Router,
                private authService: AuthenticationService) {

        this.registerRouteListener();
        this.subscribeToAuthEvents();
    }

    logout() {
        this.authService.logout()
            .then(() => {
                this.navigateTo('/login');
            });
    }

    navigateTo(route: String) {
        this.router.navigate([route]);
    }

    registerRouteListener(){
        this.router.events.subscribe(e => {
            if(e instanceof NavigationEnd){
                this.activeRoute = e.url;
            }
        });
    }
    subscribeToAuthEvents() {
        this.authService.userEntity.subscribe(data => this.isAuthorized = Boolean(data));
    }
}