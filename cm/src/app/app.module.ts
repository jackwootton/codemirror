import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, } from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AppComponent } from './app.component';
import { CmComponent } from './components/cm/cm.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CmComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
