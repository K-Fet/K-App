import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

// Services
import { AuthGuard } from './_guards/auth.guard';
import { ToasterService } from './_services/toaster.service';
import { LoginService } from './_services/login.service';
import { MemberService } from './_services/member.service';

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
        PlanMyServicesComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        routing
    ],
    bootstrap: [AppComponent],
    providers: [
        LoginService,
        MemberService,
        AuthGuard,
        ToasterService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
    ]
})
export class AppModule { }
