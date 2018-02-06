import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { CategoriesListComponent } from './categories/list/categories-list.component';
import { CategoryNewComponent } from './categories/new/category-new.component';
import { CategoryEditComponent } from './categories/edit/category-edit.component';
import { CodeDialogComponent } from './code-dialog/code-dialog.component';
import { NotFoundComponent } from './404/not-found.component';

// Services
import { ToasterService, LoginService, MemberService,
    BarmanService, ServiceService, KommissionService, RoleService, CategoryService } from './_services/index';

// Guards
import { AuthGuard } from './_guards/auth.guard';

// Helpers
import { JwtInterceptor } from './_helpers/jwt.interceptor';

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
        CategoryEditComponent,
        CategoryNewComponent,
        CategoriesListComponent,
        CodeDialogComponent,
        NotFoundComponent
    ],
    entryComponents: [
        CodeDialogComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        routing,
        FormsModule,
        ReactiveFormsModule
    ],
    bootstrap: [AppComponent],
    providers: [
        LoginService,
        MemberService,
        BarmanService,
        ServiceService,
        KommissionService,
        RoleService,
        CategoryService,
        AuthGuard,
        ToasterService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }
