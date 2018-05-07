import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { ServiceService } from '../../_services/service.service';

@Component({
    templateUrl: './service-new.component.html',
})

export class ServiceNewComponent {

    serviceForm: FormGroup;

    constructor(private serviceService: ServiceService,
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

    add(): void {
        const service = new Service();
        service.startAt = this.serviceForm.value.startAt;
        service.endAt = this.serviceForm.value.endAt;
        service.nbMax = this.serviceForm.value.nbMax;
        this.serviceService.create([service]).subscribe(() => {
            this.toasterService.showToaster('Service créé');
            this.router.navigate(['/services-manager']);
        });
    }
}
