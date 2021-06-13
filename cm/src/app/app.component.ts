import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  private doc: string = JSON.stringify({
    'checked': false,
    'dimensions': {
      'width': 5,
      'height': 10,
    },
    'id': 1,
    'name': 'A green door',
    'price': 12.5,
    'tags': [
      'home',
      'green',
    ],
  }, null, 4);

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      editor: [{ value: this.doc, disabled: true }]
    });
  }

  disable() {
    this.form.controls["editor"].disable();
  }

  enable() {
    this.form.controls["editor"].enable();
  }

  logValue() {
    console.log(this.form.controls["editor"].value);
  }
}
