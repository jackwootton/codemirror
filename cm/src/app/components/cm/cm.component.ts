import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostBinding, Input, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { basicSetup, EditorState } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import { Extension, Transaction, Compartment } from "@codemirror/state";
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
      // multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmComponent implements MatFormFieldControl<string>,
  ControlValueAccessor, AfterViewInit, OnDestroy {

  // The element to append the editor to upon creation.
  @ViewChild('host', { static: false }) host?: ElementRef;

  // Used when generating the element ID for this control.
  static nextId = 0;

  // The editor (roughly the equivalent of the CodeMirror class from 5.x).
  cm: EditorView = new EditorView();

  // The underlying native element of this component's view.
  nativeElement: any;

  private cmEnabled = new Compartment;


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

    this.fm.monitor(this.er.nativeElement, true).subscribe(
      (origin: FocusOrigin) => {
        console.log(origin);
        // origin is "touch", "mouse", "keyboard", "program", or null.
        // It is null when it loses focus.
        if (this.focused && !origin) {
          this._onTouched();
        }
        // If there is no origin (i.e. null) the control is not focused.
        this.focused = !!origin;
        this.stateChanges.next();
      });
  }


  // Implement lifecycle hooks (https://angular.io/guide/lifecycle-hooks).
  // =====================================================================

  /**
   * Invoked immediately after Angular has completed initialization of
   * this component's view.
   */
  ngAfterViewInit(): void {
    const darkTheme = EditorView.theme({}, { dark: false });
    const editable: Extension = this.cmEnabled.of(EditorView.editable.of(!this.disabled));

    // const contentEditable: Extension = EditorView.contentAttributes.of({ contenteditable: String(isEditable) });
    console.log(editable);

    this.cm = new EditorView({
      parent: this.host?.nativeElement,
      state: EditorState.create(
        {
          doc: this._value || "",
          extensions: [
            basicSetup,
            darkTheme,
            editable,
            json(),
          ],
        }),
    });
    console.log(this.cm);
  }

  /**
   * Invoked immediately before this component is destroyed.
   */
  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.er);
  }


  // Implement ControlValueAccessor (https://angular.io/api/forms/ControlValueAccessor).
  // ===================================================================================

  /**
   * Writes a new value to the element. This method is called by the forms API
   * to write to the view when programmatic changes from model to view are
   * requested.
   * @param value The new value for the element.
   */
  writeValue(value: any): void {
    console.log(`writeValue(${value})`);
    this.value = value;
  }

  /**
  * Registers a callback function that is called when the control's value
  * changes in the UI.
  * @param fn The callback function to register
  */
  registerOnChange(fn: (_: any) => void): void {
    // Store the provided function as an internal method.
    this._onChange = fn;
  }


  /**
  * Registers a callback function is called by the forms API on initialization
  * to update the form model on blur.
  * @param fn The callback function to register
  */
  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this._onTouched = fn;
  }

  /**
 * Function that is called by the forms API when the control status changes to
 * or from 'DISABLED'.
 * @param value The disabled status to set on the element
 */
  setDisabledState(value: boolean): void {
    console.log(`setDisabledState(${value})`);
    this.disabled = value;
  }

  /**
   * The callback function to register on UI change.
   * @param _ 
   */
  private _onChange(_: string): any {
    console.warn(`_onChange not implemented`);
  }


  /**
   * The method set in registerOnTouched. It is just a placeholder method.
   * Use it to emit changes back to the form.
   */
  private _onTouched(): any {
    console.warn(`_onTouched not implemented`);
  }


  // Implement MatFormFieldControl<string> (https://material.angular.io/components/form-field/api).
  // ==============================================================================================

  @Input()
  get value(): string | null {
    console.log(`set value(${this._value})`);
    return this.cm.state.doc.toString();
  }
  set value(value: string | null) {
    console.log(`set value(${value})`);

    const transaction: Transaction = this.cm.state.update({
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
    console.log(`get placeholder() -> ${this._placeholder}`);

    return this._placeholder;
  }
  set placeholder(value: string) {
    console.log(`set placeholder(${value})`);

    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string = '';


  /** Whether the control is focused. */
  @Input()
  get focused(): boolean {
    console.log(`get focused() -> ${this._focused}`);

    return this._focused;
  }
  set focused(value: boolean) {
    console.log(`set focused(${value})`);

    this._focused = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _focused: boolean = false;


  /** Whether the control is empty. */
  @Input()
  get empty(): boolean {
    console.log(`get empty() -> ${this._empty}`);

    return this._empty;
  }
  set empty(value: boolean) {
    console.log(`set empty(${value})`);

    this._empty = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _empty: boolean = false;


  /** Whether the `MatFormField` label should try to float. */
  @Input()
  get shouldLabelFloat(): boolean {
    console.log(`get shouldLabelFloat() -> ${this._shouldLabelFloat}`);

    return this._required;
  }
  set shouldLabelFloat(value: boolean) {
    console.log(`set shouldLabelFloat(${value})`);

    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _shouldLabelFloat = false;

  /** Whether the control is required. */
  @Input()
  get required(): boolean {
    console.log(`set required(${this._required})`);

    return this._required;
  }
  set required(value: boolean) {
    console.log(`set required(${value})`);

    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;


  /** Whether the control is disabled. */
  @Input()
  get disabled(): boolean {
    console.log(`get disabled() -> ${this._disabled}`);

    return this._disabled;
  }
  set disabled(value: boolean) {
    console.log(`set disabled(${value})`);

    this.cm.dispatch({
      effects: this.cmEnabled.reconfigure(EditorView.editable.of(!value))
    })

    this._disabled = coerceBooleanProperty(value);
    // const t: Transaction = this.cm.state.update();


    // const editable: Extension = this.cmEnabled.of(EditorView.editable.of(!this.disabled)

    // TODO: disable codemirror view
    // Facet that provides additional DOM attributes for the editor's editable DOM element.
    // const e: Extension = EditorView.editable.of({ contenteditable: "true" });
    // const transaction: Transaction = this.cm.state.update();

    this.stateChanges.next();
  }
  private _disabled = false;


  /** Whether the control is in an error state. */
  get errorState(): boolean {
    console.log(`get errorState() -> ${this._disabled}`);

    return this.ngControl.errors !== null;
  }
  set errorState(value: boolean) {
    console.log(`set errorState(${value})`);

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
    console.log(`get autofilled() -> ${this._disabled}`);

    return this._autofilled;
  }
  set autofilled(value: boolean) {
    console.log(`set autofilled(${value})`);

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
    // TODO: give the editor focus
    console.log(`onContainerClick(${event})`);
  }
}


