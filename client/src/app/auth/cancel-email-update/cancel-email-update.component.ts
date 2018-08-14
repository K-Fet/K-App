import { Component, OnInit } from '@angular/core';
import { AuthService, ToasterService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';

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
        setTimeout(this.router.navigate(['/login']), 1000);
      }
    });
  }

  cancelEmail(): void {
    this.authService.cancelEmailUpdate(this.userId, this.email).subscribe(() => {
      this.toasterService.showToaster('Annulation enregistré, veuillez vous connecter');
      setTimeout(this.router.navigate(['/login']), 1000);
    });
  }
}
