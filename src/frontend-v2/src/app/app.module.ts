import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './core/login/login.component';
import { SignupComponent } from './core/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AlertbannerComponent } from './shared/alertbanner/alertbanner.component';
import { DepositComponent } from './core/home/deposit/deposit.component';
import { SendComponent } from './core/home/send/send.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NavComponent,
    FooterComponent,
    AlertbannerComponent,
    DepositComponent,
    SendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
