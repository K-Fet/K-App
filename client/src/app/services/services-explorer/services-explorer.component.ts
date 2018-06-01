import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services';
import { ConnectedUser } from '../../_models';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    templateUrl: './services-explorer.component.html',
})

export class ServiceExplorerComponent implements OnInit {

    private user: ConnectedUser;

    constructor(private authService: AuthService, private ngxPermissionsService: NgxPermissionsService) { }

    ngOnInit(): void {
        this.authService.$currentUser.subscribe(user => {
            this.user = user;
        });
    }

    isActive(): Boolean {
        return this.user.isBarman() && this.user.barman.active;
    }

    hasServiceWritePerm(): Boolean {
        return this.ngxPermissionsService.getPermissions()['service:write'] !== undefined;
    }
}
