import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Kommission } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { KommissionService } from '../../_services/kommission.service';

@Component({
  templateUrl: './kommission-new.component.html',
})

export class KommissionNewComponent implements OnInit {
    name: string;
    description: string;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);
    descriptionFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private kommissionService: KommissionService, private toasterService: ToasterService, private router: Router) {}
    ngOnInit(): void {

    }

    add() {
        const kommission = new Kommission();
        kommission.name = this.name;
        kommission.description = this.description;
        this.kommissionService.create(kommission).subscribe(() => {
            this.toasterService.showToaster('Kommission créée');
            this.router.navigate(['/kommissions'] );
        });
    }
}
