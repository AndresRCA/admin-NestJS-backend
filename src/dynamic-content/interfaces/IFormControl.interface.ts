// would using a class help for documentation?
export class IFormControl<T = any> {
  name: string;
  tag?: 'input' | 'select' | 'textarea' | 'button';
  label?: string;
  /**
   * the text to show inside a button when tag is 'button'
   */
  content?: string;
  attributes?: {
    type?: 'text' | 'radio' | 'checkbox' | 'number' | 'tel' | 'date' | 'email' | 'url' | 'search' | 'password';
    placeholder?: string;
    /**
     * regex pattern as a string
     */
    pattern?: '[0-9]*' | '[0-9]{3}-[0-9]{7}';
    required?: true;
    disabled?: true;
    /**
     * the default value to place in a control, for example an input that's already filled out
     */
    value?: string | number | boolean | Object;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  /**
   * refers to these validators: https://angular.io/api/forms/Validators#validators
   */
  validators?: Array<'required' | 'requiredTrue' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'nullValidator' | 'compose' | 'composeAsync'>;
  /**
   * data to fill the form control
   */
  data?: Array<T>;
  /**
   * method to execute (in the case of a button)
   */
  action?: string;
  /**
   * must be the name of a form control (this is for external controls that execute actions and fill another control)
   */
  fills?: string;
  /**
   * the name of the group the control belongs to.
   * For an example see: REPORTES / REPORTE DE FACTURACION, Franquicia -> GRUPO: GRUPO FIBEX
   */
  group?: string;
  /**
   * button that appears to the right side of the control
   */
  buttonGroup?: 'add' | 'search';
  /**
   * button that appears to the left side of the control, usually used to specify units (like USD, BS, etc)
   */
  buttonLabel?: {
    icon?: string;
    content?: string;
  }
}