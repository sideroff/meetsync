import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material';

// Routing
import { AppRoutingModule } from '../routing/app-routing.module';

// Components
import { AppComponent } from '../components/app/app.component';
import { HomeComponent } from '../components/home/home.component';
import { TimelineComponent } from '../components/timeline/timeline.component';
import { CountrySelectControlComponent } from '../components/country-select-control/country-select-control.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { LoaderComponent } from '../components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TimelineComponent,
    CountrySelectControlComponent,
    NotFoundComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
