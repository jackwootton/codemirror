import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CmComponent } from './cm.component';

@NgModule({
    declarations: [
        CmComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
    ],
    exports: [CmComponent],
    providers: [],
    bootstrap: []
})
export class CmModule { }
