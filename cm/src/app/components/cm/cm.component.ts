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
    console.log(this.cm);
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
  
  /** The placeholder for this control. */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string = '';

  /** Whether the control is focused. */
  @Input()
  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _focused: boolean = false;

  /** Whether the control is empty. */
  @Input()
  get empty(): boolean {
    return this._empty;
  }
  set empty(value: boolean) {
    this._empty = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _empty: boolean = false;

  /** Whether the `MatFormField` label should try to float. */
  @Input()
  get shouldLabelFloat(): boolean {
    return this._required;
  }
  set shouldLabelFloat(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _shouldLabelFloat = false;

  /** Whether the control is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  /** Whether the control is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    // TODO: disable codemirror view
    this.stateChanges.next();
  }
  private _disabled = false;


  /** Whether the control is in an error state. */
  get errorState(): boolean {
    return this.ngControl.errors !== null;
  }
  set errorState(value: boolean) {
    // this._errorState = coerceBooleanProperty(value);
    this._errorState = this.ngControl.errors !== null;
    this.stateChanges.next();
  }
  private _errorState: boolean = false;

  /**
   * An optional name for the control type that can be used to distinguish
   * `mat-form-field` elements based on their control type. The form field will
   * add a class, `mat-form-field-type-{{controlType}}` to its root element.
   */
  controlType: string = 'codemirror';

  /**
   * Whether the input is currently in an autofilled state. If property is not
   * present on the control it is assumed to be false.
   */
  get autofilled(): boolean {
    return this._autofilled;
  }
  set autofilled(value: boolean) {
    this._autofilled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _autofilled: boolean = false;

  userAriaDescribedBy?: string | undefined;
  // ngControl: NgControl | null;

  // Used by the <mat-form-field> to specify the IDs that should be used for
  // the aria-describedby attribute.
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  /**
  * This method will be called when the form field is clicked on.
  * It allows the component to hook in and handle that click however it wants. 
  * @param _event 
  */
  onContainerClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }
}
function coerceBooleanProperty(value: boolean): boolean {
  throw new Error('Function not implemented.');
}

