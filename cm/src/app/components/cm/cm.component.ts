import { FocusMonitor } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, forwardRef, HostBinding, Input, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { basicSetup, EditorState } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { Subject } from 'rxjs';


@Component({
  selector: 'app-cm',
  templateUrl: './cm.component.html',
  styleUrls: ['./cm.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => CmComponent),
      multi: true,
    },
  ],
})
export class CmComponent implements MatFormFieldControl<string>,
  ControlValueAccessor, AfterViewInit, OnDestroy {

  // Used when generating the element ID for this control.
  static nextId = 0;

  // The editor (roughly the equivalent of the CodeMirror class from 5.x).
  cm: EditorView = new EditorView();

  // The underlying native element of this component's view.
  nativeElement: any;


  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly fm: FocusMonitor,
    private readonly er: ElementRef,
  ) {
    // The codemirror View will be attached to the underlying native element.
    this.nativeElement = er.nativeElement;

    // The NgControl for this control.
    if (this.ngControl) {
      // Setting the value accessor directly to avoid a circular import.
      this.ngControl.valueAccessor = this;
    }
  }


  // Implement lifecycle hooks.
  // ==========================

  /**
   * Invoked immediately after Angular has completed initialization of
   * this component's view.
   */
  ngAfterViewInit(): void {
    let darkTheme = EditorView.theme({}, { dark: false });
    this.cm = new EditorView({
      parent: this.er.nativeElement,
      state: EditorState.create(
        {
          doc: this._value || "",
          extensions: [basicSetup, json(), darkTheme],
        }),
    });
  }

  /**
   * Invoked immediately before this component is destroyed.
   */
  ngOnDestroy() {
    this.stateChanges.complete();
  }


  // Implement ControlValueAccessor.
  // ===============================

  /**
   * Writes a new value to the element. This method is called by the forms API
   * to write to the view when programmatic changes from model to view are
   * requested.
   * @param value The new value for the element.
   */
  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    // Store the provided function as an internal method.
    // this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }


  // Implement MatFormFieldControl<string>
  // =====================================

  @Input()
  get value(): string | null {
    return this.cm.state.doc.toString();
  }
  set value(value: string | null) {
    // create the transaction
    const transaction = this.cm.state.update({
      changes: {
        from: 0,
        to: this.cm.state.doc.length,
        insert: value || "",
      },
    });

    this.cm.dispatch(transaction);
    this._value = value;
    this.stateChanges.next();
  }
  _value: string | null = "";
  
  stateChanges: Subject<void> = new Subject<void>();
  id: string = `codemirror-${CmComponent.nextId++}`;
  placeholder: string = "";
  focused: boolean = false;
  empty: boolean = false;
  shouldLabelFloat: boolean = false;
  required: boolean = false;
  disabled: boolean = false;
  errorState: boolean = false;
  controlType?: string | undefined;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  // ngControl: NgControl | null;

  // Used by the <mat-form-field> to specify the IDs that should be used for
  // the aria-describedby attribute.
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }
}
