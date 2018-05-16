import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services';
import { ConnectedUser } from '../../_models';

@Component({
    templateUrl: './services-explorer.component.html',
})

export class ServiceExplorerComponent implements OnInit {

    private user: ConnectedUser;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.$currentUser.subscribe(user => {
            this.user = user;
        });
    }

    isActive(): Boolean {
        if (this.user.isBarman() && this.user.barman.active) return true;
        return false;
    }
}
