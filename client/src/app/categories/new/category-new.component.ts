import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { CategoryService } from '../../_services/category.service';

@Component({
  templateUrl: './member-new.component.html',
})

export class CategoryNewComponent implements OnInit {
    name: string;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(private categoryService: CategoryService, private toasterService: ToasterService, private router: Router) {}
    ngOnInit(): void {

    }

    add() {
        const category = new Category();
        category.name = this.name;
        this.categoryService.create(category).subscribe(() => {
            this.toasterService.showToaster('Catégorie de service créé', 'Fermer');
            this.router.navigate(['/categories'] );
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
