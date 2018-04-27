import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Permission} from '../_models';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs';
import {NgxPermissionsService} from 'ngx-permissions';

@Injectable()
export class PermissionService {

    constructor(private http: HttpClient,
                private ngxPermissions: NgxPermissionsService) {
    }

    getAll(): Observable<Array<Permission>> {
        return this.http.get<Array<Permission>>('/api/permissions').concatMap(perms => {
            const obs = [];

            perms.forEach(p => {
                return obs.push(
                    Observable.fromPromise(this.ngxPermissions.hasPermission(p.name as string)
                        .then(hasP => {
                            p.disabled = !hasP;
                            return p;
                        })
                    )
                );
            });

            return Observable.forkJoin(obs);
        });
    }
}
