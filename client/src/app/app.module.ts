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
import { UsersListComponent } from './users/list/users-list.component';
import { UserNewComponent } from './users/new/user-new.component';

// Services
import { AuthGuard } from './_guards/auth.guard';
import { ToasterService } from './_services/toaster.service';
import { LoginService } from './_services/login.service';
import { UserService } from './_services/user.service';

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
        UsersListComponent,
        UserNewComponent
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
        UserService,
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
