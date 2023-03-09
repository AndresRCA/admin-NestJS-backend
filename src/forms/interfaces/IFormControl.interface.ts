import { IStyleRules } from "./IStyleRules.interface";

export interface IFormControl<T = any> {
  name: string;
  tag?: 'input' | 'select' | 'textarea' | 'button';
  label?: string;
  style_rules?: IStyleRules;
  form_array_controls?: Array<IFormControl>; // this array of controls refers to what gets asked again in a form (could be only one control, or more)
  is_form_array?: true;
  attributes?: {
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
}