export interface Address {
  country: string;
  city: string;
  address: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email:string;
  phone: string;
  img?: string;
}
