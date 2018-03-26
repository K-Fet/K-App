import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatDatetimepickerModule,
    MatNativeDatetimeModule
  } from '@mat-datetimepicker/core';

// Libraries
import { NgxPermissionsModule } from 'ngx-permissions';

// Routes
import { routing } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { MembersListComponent } from './members/list/members-list.component';
import { MemberNewComponent } from './members/new/member-new.component';
import { MemberEditComponent } from './members/edit/member-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyServicesComponent } from './services/my-services/my-services.component';
import { PlanningComponent } from './services/planning/planning.component';
import { PlanMyServicesComponent } from './services/plan-my-services/plan-my-services.component';
import { BarmenListComponent } from './barmen/list/barmen-list.component';
import { BarmanNewComponent } from './barmen/new/barman-new.component';
import { BarmanViewComponent } from './barmen/view/barman-view.component';
import { BarmanEditComponent } from './barmen/edit/barman-edit.component';
import { KommissionsListComponent } from './kommissions/list/kommissions-list.component';
import { KommissionNewComponent } from './kommissions/new/kommission-new.component';
import { KommissionEditComponent } from './kommissions/edit/kommission-edit.component';
import { RolesListComponent } from './roles/list/roles-list.component';
import { RoleNewComponent } from './roles/new/role-new.component';
import { RoleEditComponent } from './roles/edit/role-edit.component';
import { CodeDialogComponent } from './code-dialog/code-dialog.component';
import { NotFoundComponent } from './404/not-found.component';
import { OpenServicesComponent } from './services/open-services/open-services.component';
import { WeekPickerComponent } from './services/week-picker/week-picker.component';
import { SpecialAccountListComponent } from './special-accounts/list/special-accounts-list.component';
import { SpecialAccountNewComponent } from './special-accounts/new/special-account-new.component';
import { SpecialAccountEditComponent } from './special-accounts/edit/special-account-edit.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

// Services
import { BarmanService, KommissionService, LoginService,
    MemberService, MeService, PermissionService, RoleService,
    ServiceService, SpecialAccountService, TemplateService, ToasterService } from './_services/';

// Guards
import { EditGuard } from './_guards/edit.guard';

// Helpers
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorsHandler } from './_helpers/error.handler';

// Date
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

// Modules
import { MaterialModule } from './_helpers/material.module';

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        LoginComponent,
        MenuComponent,
        MembersListComponent,
        MemberNewComponent,
        MemberEditComponent,
        DashboardComponent,
        MyServicesComponent,
        PlanningComponent,
        PlanMyServicesComponent,
        BarmenListComponent,
        BarmanNewComponent,
        BarmanViewComponent,
        BarmanEditComponent,
        KommissionEditComponent,
        KommissionNewComponent,
        KommissionsListComponent,
        RoleEditComponent,
        RoleNewComponent,
        RolesListComponent,
        CodeDialogComponent,
        NotFoundComponent,
        OpenServicesComponent,
        WeekPickerComponent,
        SpecialAccountListComponent,
        SpecialAccountNewComponent,
        SpecialAccountEditComponent,
        ConfirmationDialogComponent
    ],
    entryComponents: [
        CodeDialogComponent,
        ConfirmationDialogComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        MatNativeDatetimeModule,
        MatDatetimepickerModule,
        NgxPermissionsModule.forRoot()
    ],
    bootstrap: [AppComponent],
    providers: [
        LoginService,
        MemberService,
        BarmanService,
        ServiceService,
        KommissionService,
        RoleService,
        ToasterService,
        TemplateService,
        SpecialAccountService,
        PermissionService,
        MeService,
        EditGuard,
        {
            provide: LOCALE_ID, useValue: 'fr'
        },
        {
            provide: ErrorHandler,
            useClass: ErrorsHandler
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }
