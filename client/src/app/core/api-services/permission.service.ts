import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../../shared-old/models';
import { forkJoin, from, Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class PermissionService {

  constructor(private http: HttpClient,
              private ngxPermissions: NgxPermissionsService) {}

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>('/api/v1/permissions')
      .pipe(
        concatMap((perms) => {
          const obs = [];

          perms.forEach((p) => {
            return obs.push(
              from(this.ngxPermissions.hasPermission(p.name as string)
                .then((hasP) => {
                  p.disabled = !hasP;
                  return p;
                }),
              ),
            );
          });

          return forkJoin(obs);
        }),
      );
  }
}
