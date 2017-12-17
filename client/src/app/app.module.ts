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

// Services
import { AuthGuard } from './_guards/auth.guard';

// Helpers
import { JwtInterceptor } from './_helpers/jwt.interceptor';

// Modules
import { MaterialModule } from './_helpers/material.module';
import { LoginService } from './_services/login.service';

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        LoginComponent,
        MenuComponent,
        MembersListComponent,
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
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
    ]
})
export class AppModule { }
