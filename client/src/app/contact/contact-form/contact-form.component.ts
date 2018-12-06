import { Component, OnInit } from '@angular/core';
import { DynamicFormGroupModel, DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-contact-form',
  template: `
    <app-base-contact-form
      [title]="formTitle"
      [model]="formModel"
      (onSubmit)="submit($event)"
    ></app-base-contact-form>
  `,
})
export class ContactFormComponent implements OnInit {

  formModel: DynamicFormModel = [];
  formTitle: string = 'Ce formulaire n\'existe pas';
  formName: string;

  constructor(private contactService: ContactService,
              private toasterService: ToasterService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { type: string }) => {
      this.formName = data.type;

      switch (data.type) {
        case 'concert':
          this.formTitle = 'Contact pour un concert';
          this.formModel = [
            new DynamicFormGroupModel({
              id: 'info',
              legend: 'Vos informations',
              group: [
                new DynamicInputModel({
                  id: 'lastName',
                  label: 'Nom',
                  validators: { required: null },
                }),
                new DynamicInputModel({
                  id: 'firstName',
                  label: 'Prénom',
                  validators: { required: null },
                }),
                new DynamicInputModel({
                  id: 'email',
                  label: 'Email',
                  validators: { required: null, email: null },
                }),
                new DynamicInputModel({
                  id: 'phone',
                  label: 'Téléphone portable',
                  validators: { required: null, pattern: /^((\+)33|0)[1-9](\d{2}){4}$/ },
                }),
              ],
            }),
            new DynamicFormGroupModel({
              id: 'concert',
              legend: 'Votre groupe',
              group: [
                new DynamicInputModel({
                  id: 'stageName',
                  label: 'Nom de scène',
                  validators: { required: null },
                }),
                new DynamicInputModel({
                  id: 'musicStyle',
                  label: 'Genre de musique ?',
                  validators: { required: null },
                }),
                new DynamicInputModel({
                  id: 'whereListen',
                  label: 'Où vous écouter ? (lien...)',
                  validators: { required: null },
                }),
                new DynamicInputModel({
                  id: 'description',
                  label: 'Description rapide (faîtes nous rêver!)',
                  validators: { required: null },
                }),
              ],
            }),
          ];
          break;
        case 'event':
          this.formTitle = 'Contact pour un évenement/soirée';
          this.formModel = [];
          break;
        case 'lost':
          this.formTitle = 'Contact pour un objet perdu';
          this.formModel = [];
          break;
        case 'website':
          this.formTitle = 'Contact pour un problème avec le site';
          this.formModel = [];
          break;
      }
    });
  }

  submit(event) {
    // TODO Send
    this.contactService.send(this.formName, event.value, event.token).subscribe(() => {
      this.toasterService.showToaster('Votre demande a bien été enregistrée. Nous y donnerons suite dès que possible!');
      this.router.navigate(['/']);
    });
  }
}
