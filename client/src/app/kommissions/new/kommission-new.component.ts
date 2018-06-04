import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Kommission } from '../../_models';
import { KommissionService, ToasterService } from '../../_services';

@Component({
  templateUrl: './kommission-new.component.html',
})

export class KommissionNewComponent {
  name: string;
  description: string;

  nameFormControl: FormControl = new FormControl('', [Validators.required]);
  descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private router: Router) { }

  add(): void {
    const kommission = new Kommission();
    kommission.name = this.name;
    kommission.description = this.description;
    this.kommissionService.create(kommission).subscribe(() => {
      this.toasterService.showToaster('Kommission créée');
      this.router.navigate(['/kommissions']);
    });
  }
}
