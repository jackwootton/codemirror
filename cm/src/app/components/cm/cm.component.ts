import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { basicSetup, EditorState } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";


@Component({
  selector: 'app-cm',
  templateUrl: './cm.component.html',
  styleUrls: ['./cm.component.scss']
})
export class CmComponent implements OnInit, AfterViewInit {
  @ViewChild('host', { static: false }) host?: ElementRef;

 
  private jsonDocument: string =
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



  constructor() { }

  ngAfterViewInit(): void {
    let darkTheme = EditorView.theme({}, { dark: false });

    if (this.host) {
      let view = new EditorView({
        parent: this.host.nativeElement,
        state: EditorState.create(
          {
            extensions: [basicSetup, json(), darkTheme],
            doc: this.jsonDocument,
          }),
      });

      console.log(view);
    }
  }

  ngOnInit(): void {

  }

}
