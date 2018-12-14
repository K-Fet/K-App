import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../core/services/toaster.service';
import { AuthService } from '../../core/api-services/auth.service';

@Component({
  selector: 'app-cancel-email-update',
  templateUrl: './cancel-email-update.component.html',
})
export class CancelEmailUpdateComponent implements OnInit {
  userId: number;
  email: string;

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['email'] && params['userId']) {
        this.userId = +params['userId'];
        this.email = params['email'];
      } else {
        this.toasterService.showToaster('Problème dans la récupération de l\'adresse email ou du token');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  cancelEmail(): void {
    this.authService.cancelEmailUpdate(this.userId, this.email).subscribe(() => {
      this.toasterService.showToaster('Annulation enregistré, veuillez vous connecter');
      this.router.navigate(['/auth/login']);
    });
  }

}
