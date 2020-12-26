import { Document } from 'mongoose';

export interface ICategory extends Document {
  readonly category: string;
  description: string;
  events: Array<IEvent>;
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
