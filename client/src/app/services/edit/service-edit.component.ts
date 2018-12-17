import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../core/api-services/service.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Service } from '../../shared/models';

@Component({
  templateUrl: './service-edit.component.html',
})
export class ServiceEditComponent {

  serviceForm: FormGroup;
  id: number;

  constructor(private serviceService: ServiceService,
              private toasterService: ToasterService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      const service = await this.serviceService.getById(+this.id);
      this.serviceForm.get('startAt').setValue(service.startAt);
      this.serviceForm.get('endAt').setValue(service.endAt);
      this.serviceForm.get('nbMax').setValue(service.nbMax);
    });
  }

  createForm(): void {
    this.serviceForm = new FormGroup({
      startAt: new FormControl('', [Validators.required]),
      endAt: new FormControl('', [Validators.required]),
      nbMax: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }

  async edit() {
    const service = new Service();
    service.id = this.id;
    service.startAt = this.serviceForm.value.startAt;
    service.endAt = this.serviceForm.value.endAt;
    service.nbMax = this.serviceForm.value.nbMax;

    await this.serviceService.update(service);
    this.toasterService.showToaster('Service modifié');
    this.router.navigate(['/services/services-manager']);
  }
}
