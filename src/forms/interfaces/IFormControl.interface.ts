export interface IFormControl<T = any> {
  tag: 'input' | 'select' | 'textarea' | 'button';
  label: string;
  icon?: string, // usually a font awesome icon class (e.g. fa-globe, fa-refresh)
  col_width: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // refers to the space the controls occupies in a row
  attributes: {
    name: string;
    type?: 'text' | 'radio' | 'checkbox' | 'number' | 'tel' | 'date' | 'email' | 'url' | 'search' | 'password';
    placeholder?: string;
    pattern?: string; // regex
    required?: true;
    disabled?: true;
    value?: string | number | boolean; // the default value of for example an input
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  },
  validators?: Array<'required' | 'requiredTrue' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'nullValidator' | 'compose' | 'composeAsync'>; // https://angular.io/api/forms/Validators#validators
  data?: Array<T>; // data to fill the form control
  value?: string | boolean | null; // default value to place in the control
  order: number; // order for the control (1 would mean it's the first element in the form)
  action?: string; // method to execute (in the case of a button)
  fills?: string // must be the name of a form control (this is for external controls that execute actions and fill another control)
  form_array?: IFormControl[]
}