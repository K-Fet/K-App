import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Kommission } from '../../_models';
import { KommissionService, ToasterService } from '../../_services';

@Component({
  templateUrl: './kommission-new.component.html',
})

export class KommissionNewComponent {
  kommissionForm:  FormGroup;

  constructor(private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private router: Router,
              private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): void {
    this.kommissionForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  add(): void {
    const kommission = new Kommission(this.kommissionForm.value);
    this.kommissionService.create(kommission).subscribe(() => {
      this.toasterService.showToaster('Kommission créée');
      this.router.navigate(['/kommissions']);
    });
  }
}
