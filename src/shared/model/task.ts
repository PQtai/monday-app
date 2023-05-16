export interface IValueOfTask {
   belongColumn: string;
   typeOfValue: string;
   _id: string;
   value: string;
   valueId: {
      _id: string;
      value: string;
      color: string;
   };
   name: string;
   position: number;
}
export interface ITask {
   _id: string;
   name: string;
   position: number;
   values: IValueOfTask[];
}
