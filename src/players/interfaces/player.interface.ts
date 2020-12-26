import { Document } from 'mongoose';
import { ICategory } from '../../categories/interfaces/category.interface';

export interface IPlayer extends Document {
  readonly phone: string;
  readonly email: string;
  category: ICategory
  name: string;
  ranking: string;
  positionRanking: number;
  urlImagePlayer: string;
}
