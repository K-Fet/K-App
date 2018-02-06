import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../_models/index';
import { ToasterService } from '../../_services/toaster.service';
import { CategoryService } from '../../_services/category.service';

@Component({
  templateUrl: './category-edit.component.html',
})

export class CategoryEditComponent implements OnInit {
    id: string;
    name: string;

    nameFormControl: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private categoryService: CategoryService,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.categoryService.getById(+this.id).subscribe(category => {
                this.name = category.name;
            },
            error => {
                this.toasterService.showToaster(error, 'Fermer');
            });
        });
    }

    edit() {
        const category = new Category();
        category.id = +this.id;
        category.name = this.name;
        this.categoryService.update(category).subscribe(() => {
            this.toasterService.showToaster('Catégorie de service modifiée', 'Fermer');
            this.router.navigate(['/categories']);
        },
        error => {
            this.toasterService.showToaster(error, 'Fermer');
        });
    }
}
