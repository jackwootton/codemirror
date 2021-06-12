import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form: FormGroup;

  private doc: string =
    JSON.stringify({
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

  constructor(private readonly fb: FormBuilder,) {
    this.form = this.fb.group({
      jsonDocument: [this.doc]
    });
  }

}
