import { IColumn } from './column';
import { IGroup } from './group';

export interface IBoard {
   _id: string;
   name: string;
   belongWorkspace?: string;
   description?: string;
   groups: IGroup[];
   columns: IColumn[];
}
export interface IBoardsResponse<T> {
   boards: T;
}

export interface IBoardResponse<T> {
   board: T;
}
