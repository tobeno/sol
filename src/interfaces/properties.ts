export interface SolPropertyDescriptor extends PropertyDescriptor {
  help?: string;
}

export interface SolPropertyDescriptorMap {
  [propertyName: string]: SolPropertyDescriptor;
}
