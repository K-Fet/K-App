import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Kommission } from '../../_models';
import { KommissionService, ToasterService } from '../../_services';

@Component({
  templateUrl: './kommission-edit.component.html',
})

export class KommissionEditComponent implements OnInit {

  updatedKommission: Kommission = new Kommission();

  kommissionForm: FormGroup;

  createForm(): void {
    this.kommissionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  constructor(private kommissionService: KommissionService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.updatedKommission.id = params['id'];
      this.kommissionService.getById(+this.updatedKommission.id).subscribe((kommission) => {
        this.updatedKommission.name = kommission.name;
        this.updatedKommission.description = kommission.description;

        this.kommissionForm.controls.description.setValue(this.updatedKommission.description);
        this.kommissionForm.controls.name.setValue(this.updatedKommission.name);

      });
    });
  }

  edit(): void {
    const kommission = this.prepareEditing();
    this.kommissionService.update(kommission).subscribe(() => {
      this.toasterService.showToaster('Kommission modifiée');
      this.router.navigate(['/kommissions']);
    });
  }

  prepareEditing(): Kommission {
    const values = this.kommissionForm.value;
    const kommission = new Kommission();
    kommission.id = this.updatedKommission.id;
    kommission.name = values.name;
    kommission.description = values.description;
    return kommission;
  }
}
