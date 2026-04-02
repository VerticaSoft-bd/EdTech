export type InputType = 'text' | 'number' | 'textarea' | 'toggle' | 'dropdown' | 'checkbox' | 'radio' | 'file' | 'date';

export interface FormField {
  fieldId: string;
  label: string;
  type: InputType;
  required: boolean;
  options?: string[];
  placeholder?: string;
}
