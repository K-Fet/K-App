import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../../core/api-services/services.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Service } from '../../shared/models';

@Component({
  templateUrl: './service-new.component.html',
})
export class ServiceNewComponent {

  serviceForm: FormGroup;

  constructor(private serviceService: ServicesService,
    private toasterService: ToasterService,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm();

  }

  createForm(): void {
    this.serviceForm = new FormGroup({
      startAt: new FormControl('', [Validators.required]),
      endAt: new FormControl('', [Validators.required]),
      nbMax: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }

  async add(): Promise<void> {
    const service: Service = {
      startAt: this.serviceForm.value.startAt,
      endAt: this.serviceForm.value.endAt,
      nbMax: this.serviceForm.value.nbMax,
    };
    await this.serviceService.create(service);

    this.toasterService.showToaster('Service créé');
    this.router.navigate(['/services/services-manager']);
  }
}
