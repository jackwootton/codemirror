import { AfterViewInit, Component, ElementRef, Input, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { basicSetup, EditorState } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';


@Component({
  selector: 'app-cm',
  templateUrl: './cm.component.html',
  styleUrls: ['./cm.component.scss']
})
export class CmComponent implements MatFormFieldControl<string>,
  ControlValueAccessor, AfterViewInit {
  @ViewChild('host', { static: false }) host?: ElementRef;

  @Input() doc: string = "";

  constructor(@Optional() @Self() public ngControl: NgControl) {
    // The NgControl for this control.
    if (this.ngControl) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  // component lifecycle hooks
  ngAfterViewInit(): void {
    let darkTheme = EditorView.theme({}, { dark: false });

    if (this.host) {
      let view = new EditorView({
        parent: this.host.nativeElement,
        state: EditorState.create(
          {
            extensions: [basicSetup, json(), darkTheme],
            doc: this.doc,
          }),
      });

      console.log(view);
    }
  }

  // implement ControlValueAccessor
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  // implement MatFormFieldControl<string>

  @Input()
  get value(): string | null {
    return this._value;
  }
  set value(value: string | null) {

    EditorState.create(
      {
        doc: value || "",
      }
    );
  }
  _value: string | null = "";


  stateChanges: Observable<void> = new Subject<void>();
  id: string = "";
  placeholder: string = "";
  // ngControl: NgControl | null;
  focused: boolean = false;
  empty: boolean = false;
  shouldLabelFloat: boolean = false;
  required: boolean = false;
  disabled: boolean = false;
  errorState: boolean = false;
  controlType?: string | undefined;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;

  setDescribedByIds(ids: string[]): void {
    throw new Error('Method not implemented.');
  }

  onContainerClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }
}
