/* eslint-disable array-callback-return */
import {
   PayloadAction,
   createAsyncThunk,
   createSlice,
   isFulfilled,
   isPending,
   isRejected,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_API_URL } from '~/config/constants';
import { IBoard, IBoardResponse, IBoardsResponse } from '~/shared/model/board';
import { IResponseData } from '~/shared/model/global';
import { IItemInListValueSelect, IValueOfTask } from '~/shared/model/task';
import { serializeAxiosError } from '~/shared/reducers/reducer.utils';

const apiUrl = SERVER_API_URL;
// slice

interface IInitState {
   listBoard: {
      datas?: IBoard[];
      loading: boolean;
      error: boolean;
      status: string | number;
      mess: string;
   };
   currBoard: {
      data?: IBoard;
      loading: boolean;
      error: boolean;
      status: string | number;
      mess: string;
   };
   indexTab: number;
}

const initialState: IInitState = {
   listBoard: {
      datas: [],
      loading: false,
      error: false,
      status: '',
      mess: '',
   },
   currBoard: {
      data: undefined,
      loading: false,
      error: false,
      status: '',
      mess: '',
   },
   indexTab: 0,
};

// body request

interface IParamsRequest {
   id: string;
   idWorkspace?: string;
}

interface ICreateBoard {
   idWorkspace: string;
   name: string;
}
interface IEditBoard {
   idBoard: string;
   name: string;
   description?: string;
}

// actions
// Get all board
export const getListBoards = createAsyncThunk(
   'get-list-boards-slice',
   async (params: IParamsRequest) => {
      const requestUrl = `${apiUrl}v1/api/workspace/${params.id}/board`;
      return await axios.get<IResponseData<IBoardsResponse<IBoard[]>>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

// Get detail board
export const getBoardDetail = createAsyncThunk(
   'get-board-detail-slice',
   async (params: IParamsRequest) => {
      const requestUrl = `${apiUrl}v1/api/board/${params.id}`;
      return await axios.get<IResponseData<IBoardResponse<IBoard>>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

// Create  board

export const createBoard = createAsyncThunk(
   'create-board-slice',
   async (bodyRequest: ICreateBoard) => {
      const requestUrl = `${apiUrl}v1/api/workspace/${bodyRequest.idWorkspace}/board`;
      return await axios.post<IResponseData<IBoard>>(requestUrl, {
         name: bodyRequest.name,
      });
   },
   { serializeError: serializeAxiosError },
);
// Edit board
export const editBoard = createAsyncThunk(
   'edit-board-slice',
   async (bodyRequest: IEditBoard) => {
      const { idBoard, ...rest } = bodyRequest;
      const requestUrl = `${apiUrl}v1/api/board/${idBoard}`;
      return await axios.patch<IResponseData<IBoard>>(requestUrl, rest);
   },
   { serializeError: serializeAxiosError },
);

// Delete board
export const deleteBoard = createAsyncThunk(
   'delete-board-slice',
   async (params: IParamsRequest) => {
      const { id, idWorkspace } = params;
      const requestUrl = `${apiUrl}v1/api/workspace/${idWorkspace}/board/${id}`;
      return await axios.delete<IResponseData<undefined>>(requestUrl);
   },
   { serializeError: serializeAxiosError },
);

const boardSlice = createSlice({
   name: 'BoardSlice',
   initialState,
   extraReducers(builder) {
      builder
         .addMatcher(isFulfilled(getListBoards), (state, action) => {
            state.listBoard.datas = action.payload.data.metadata?.boards;
            state.listBoard.error = false;
            state.listBoard.loading = false;
            state.listBoard.status = action.payload.data.status;
            state.listBoard.mess = action.payload.data.message;
         })
         .addMatcher(isPending(getListBoards), (state, action) => {
            state.listBoard.loading = true;
         })
         .addMatcher(isRejected(getListBoards), (state, action) => {
            state.listBoard.error = true;
            state.listBoard.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.listBoard.status = response.status;
               state.listBoard.mess = response.message;
            }
         })
         .addMatcher(isFulfilled(getBoardDetail), (state, action) => {
            state.currBoard.data = action.payload.data.metadata?.board;
            state.listBoard.error = false;
            state.listBoard.loading = false;
            state.listBoard.status = action.payload.data.status;
            state.listBoard.mess = action.payload.data.message;
         })
         .addMatcher(isPending(getBoardDetail), (state, action) => {
            state.listBoard.loading = true;
         })
         .addMatcher(isRejected(getBoardDetail), (state, action) => {
            state.listBoard.error = true;
            state.listBoard.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.listBoard.status = response.status;
               state.listBoard.mess = response.message;
            }
         })
         .addMatcher(isFulfilled(createBoard), (state, action) => {
            state.currBoard.data = action.payload.data.metadata;
            const newBoard = action.payload.data.metadata;
            if (newBoard && state.listBoard.datas) {
               state.listBoard.datas.push(newBoard);
            }
            state.currBoard.error = false;
            state.currBoard.loading = false;
            state.currBoard.status = action.payload.data.status;
            state.currBoard.mess = action.payload.data.message;
         })
         .addMatcher(isFulfilled(getBoardDetail), (state, action) => {
            state.currBoard.data = action.payload.data.metadata?.board;
         })
         .addMatcher(isPending(getBoardDetail), (state, action) => {
            state.currBoard.loading = true;
         })
         .addMatcher(isRejected(getBoardDetail), (state, action) => {
            state.currBoard.error = true;
            state.currBoard.loading = false;
            if (action?.error) {
               const { response } = action.error as { response: any };
               state.currBoard.status = response.status;
               state.currBoard.mess = response.message;
            }
         });
   },
   reducers: {
      handleAddGroup: (state, action) => {
         const newGroup = action.payload; // Thông tin của group mới cần thêm vào
         const updatedGroups = state.currBoard.data?.groups?.concat(newGroup); // Tạo mảng mới kết hợp groups hiện tại và group mới
         if (state.currBoard.data && state.currBoard.data.groups && updatedGroups) {
            return {
               ...state,
               currBoard: {
                  ...state.currBoard,
                  data: {
                     ...state.currBoard.data,
                     groups: updatedGroups, // Cập nhật mảng groups bằng mảng mới
                  },
               },
            };
         }
      },
      handleDelGroup: (state, action) => {
         const groupId = action.payload; // Id của group cần xóa
         if (state.currBoard.data && state.currBoard.data.groups && groupId) {
            return {
               ...state,
               currBoard: {
                  ...state.currBoard,
                  data: {
                     ...state.currBoard.data,
                     groups: state.currBoard.data?.groups.filter((group) => group._id !== groupId),
                  },
               },
            };
         }
      },
      handleAddValueListStatus: (state, action) => {
         const { columnId, newValueStatus } = action.payload;
         state.currBoard.data?.columns?.forEach((col) => {
            if (col._id === columnId) {
               col.defaultValues = col.defaultValues.concat(newValueStatus);
            }
         });

         return state;
      },

      handleEditValueListStatus: (
         state,
         action: PayloadAction<{
            columnId: string;
            valueSelectId: string;
            key: 'color' | 'value';
            value: string;
         }>,
      ) => {
         const { columnId, valueSelectId, key, value } = action.payload;
         const newDataColumn = state.currBoard.data?.columns?.map((col) => {
            if (col._id === columnId) {
               const newDefaultValues = col.defaultValues.map((val) => {
                  if (val._id === valueSelectId) {
                     return {
                        ...val,
                        [key]: value,
                     };
                  }
                  return val;
               });
               return {
                  ...col,
                  defaultValues: newDefaultValues,
               };
            }
            return col;
         });
         console.log(newDataColumn);

         if (newDataColumn && state.currBoard.data && state.currBoard.data.columns) {
            return {
               ...state,
               currBoard: {
                  ...state.currBoard,
                  data: {
                     ...state.currBoard.data,
                     columns: newDataColumn,
                  },
               },
            };
         }

         return state;
      },
      handleEditValueSelected: (
         state,
         action: PayloadAction<{
            idValue: string | null;
            data: IItemInListValueSelect;
         }>,
      ) => {
         const { idValue, data } = action.payload;

         state.currBoard.data?.groups?.forEach((group) => {
            group.tasks.forEach((task) => {
               task.values.forEach((value) => {
                  if (value._id === idValue) {
                     value.valueId = data;
                  }
               });
            });
         });
      },
      handleDeleteValueListStatus: (
         state,
         action: PayloadAction<{
            columnId: string;
            valueSelectId: string;
         }>,
      ) => {
         const { columnId, valueSelectId } = action.payload;
         state.currBoard.data?.columns?.forEach((col) => {
            if (col._id === columnId) {
               col.defaultValues = col.defaultValues.filter((val) => val._id !== valueSelectId);
            }
         });
         return state;
      },
      // handleUpdateAllSelectedValue: (
      //    state,
      //    action: PayloadAction<{
      //       valueId: string;
      //       key: 'color' | 'value';
      //       value: string;
      //    }>,
      // ) => {
      //    // update tất cả các value trong group nếu thay đổi value đang được selected?
      //    const { valueId, key, value } = action.payload;

      //    const updatedGroups = state.currBoard.data?.groups.map((group) => {
      //       const updatedTasks = group.tasks.map((task) => {
      //          const updatedValues = task.values.map((val) => {
      //             if (val._id && val._id === valueId) {
      //                return {
      //                   ...val,
      //                   valueId: {
      //                      ...val.valueId,
      //                      [key]: value,
      //                   },
      //                };
      //             }
      //             return val;
      //          });

      //          return {
      //             ...task,
      //             values: updatedValues,
      //          };
      //       });

      //       return {
      //          ...group,
      //          tasks: updatedTasks,
      //       };
      //    });
      //    if (updatedGroups && state.currBoard.data) {
      //       return {
      //          ...state,
      //          currBoard: {
      //             ...state.currBoard,
      //             data: {
      //                ...state.currBoard.data,
      //                groups: updatedGroups,
      //             },
      //          },
      //       };
      //    }
      // },
      setIndexTab: (
         state,
         action: PayloadAction<{
            index: 0 | 1;
         }>,
      ) => {
         console.log('chay vo day r');

         return {
            ...state,
            indexTab: action.payload.index,
         };
      },
      resetCurrBoard(state) {
         state.currBoard = {
            data: undefined,
            loading: false,
            error: false,
            status: '',
            mess: '',
         };
      },
   },
});

export const {
   resetCurrBoard,
   handleAddValueListStatus,
   handleEditValueListStatus,
   handleDeleteValueListStatus,
   handleAddGroup,
   handleDelGroup,
   handleEditValueSelected,
   // handleUpdateAllSelectedValue,
   setIndexTab,
} = boardSlice.actions;

export default boardSlice.reducer;
