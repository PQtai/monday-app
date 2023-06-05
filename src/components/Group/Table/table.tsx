/* eslint-disable array-callback-return */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { IGroup } from '~/shared/model/group';
import { useState, useRef, createRef, useEffect } from 'react';
import './table.scss';
import { message } from 'antd';
import axios from 'axios';
import MenuTask from '~/components/MenuTask/menuTask';
import { useAppDispatch, useAppSelector } from '~/config/store';
import TaskEdit from './TaskEdit/taskEdit';
import Column from '~/components/Column/column';
import ListType from '~/components/ListTypes/listTypes';
import { createColumn } from '~/components/MainTable/mainTable.reducer';
import { ITask } from '~/shared/model/task';
import { IResponseData } from '~/shared/model/global';
import ValueTask from './ValueTask/valueTask.v2';
import { handleAddTaskToGroup, handleDeleteTasksFromGroup } from '~/pages/Board/board.reducer';
import { SERVER_API_URL } from '~/config/constants';
interface IPropsTable {
   data: IGroup;
   idBoard?: string;
}

const Table = ({ data, idBoard }: IPropsTable) => {
   // const [listTask, setListTask] = useState<ITask[]>(data.tasks);
   // useEffect(() => {
   //    setListTask(data.tasks);
   // }, [data.tasks]);
   const columns = useAppSelector((state) => state.boardSlice.currBoard.data?.columns);

   // const [isRenameTask, setIsRenameTask] = useState(false);
   // const [valueTask, setValueTask] = useState('');
   const [valueAddTask, setValueAddTask] = useState('');
   const [messageApi, contextHolder] = message.useMessage();
   const handleValueAdd = useRef<any>();
   // const handleEditInput = useRef<HTMLInputElement>(null);

   const listTypeElement: React.RefObject<HTMLDivElement> = createRef();
   const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

   const dispatch = useAppDispatch();
   const filterItem = useAppSelector((state) => state.boardSlice.filter);
   // const currGroup = useAppSelector(state => state.groupSlice.editGroup.data)

   // const handleRenameTask = (e: any, taskID: any) => {
   //    setIsRenameTask(true);
   // };
   const toggleCheckedTask = (e: any, taskId: string) => {
      if (e.target.checked) {
         setCheckedTasks((pre) => [...pre, taskId]);
      } else {
         setCheckedTasks((pre) => pre.filter((item) => item !== taskId));
      }
   };

   const handleDeleteTask = async (taskIds: string[]) => {
      messageApi.loading('Đợi xý nhé !...');
      await axios.delete(
         `${SERVER_API_URL}v1/api/group/${data._id}/tasks?ids=${taskIds.join(',')}`,
      );
      // setListTask((pre) => pre.filter((item) => item._id !== taskId));
      messageApi.success('Xoá task thành công!');
      dispatch(
         handleDeleteTasksFromGroup({
            groupId: data._id,
            taskIds,
         }),
      );
      setCheckedTasks([]);
   };
   const handleAddColumn = async (id: string, position?: number) => {
      try {
         messageApi.loading('Đợi xý nhé...!');
         if (idBoard && columns) {
            // console.log({ position });
            await dispatch(
               createColumn({
                  idBoard,
                  belongType: id,
                  position: position ?? columns.length,
               }),
            );
         }
         // messageApi.success(`Thêm mới column ${res.data.metadata.column.name} thành công!`);
         messageApi.success(`Thêm mới column thành công!`);
      } catch (error) {
         messageApi.error(`${error}`);
      }
   };
   const handleAddTask = () => {
      if (valueAddTask !== '') {
         const addTask = async () => {
            messageApi.loading('Đợi xý nhé !...');
            const res = await axios.post<
               IResponseData<{
                  task: ITask;
               }>
            >(`http://localhost:3001/v1/api/board/${idBoard}/group/${data._id}/task`, {
               name: valueAddTask,
               position: data.tasks.length,
            });
            if (res.data.metadata) {
               // setListTask((pre) => {
               //    const newTask = res.data.metadata?.task;
               //    if (newTask) {
               //       return [...pre, newTask];
               //    }
               //    return pre;
               // });
               dispatch(
                  handleAddTaskToGroup({
                     groupId: data._id,
                     newTask: res.data.metadata?.task,
                  }),
               );
               messageApi.success('Tạo task thành công!');
               setValueAddTask('');
            }
         };
         addTask();
      } else {
         messageApi.error('Vui lòng nhập tên task');
      }
   };
   // const filterValue = (data: IColumn[]) => {
   //    const result = filterItem.map(item => {
   //       data.find(col => col._id === item._id)
   //    })
   //    return result;
   // };
   // console.log(filterValue(columns!));
   const [isOpenAddColumn, setIsOpenAddColumn] = useState<boolean>(false);
   const dropdownColumn = useRef<any>(null);
   useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   });
   const handleClickOutside = (event: any) => {
      if (!dropdownColumn.current.contains(event.target)) {
         setIsOpenAddColumn(false);
      }
   };
   return (
      <>
         <table className="table__group">
            {contextHolder}
            <thead className="table__group-header">
               <tr>
                  <th className="column__group-check">
                     <label htmlFor="checked"></label>
                     <input type="checkbox" id="checked" />
                  </th>
                  <th className="column__group">Task</th>
                  {filterItem.length > 0
                     ? columns?.map((col, index) => {
                          if (filterItem.includes(col._id)) {
                             return (
                                <Column
                                   key={col._id}
                                   col={col}
                                   position={index}
                                   handleAddColumn={handleAddColumn}
                                />
                             );
                          }
                       })
                     : columns?.map((col, index) => {
                          return (
                             <Column
                                key={col._id}
                                col={col}
                                position={index}
                                handleAddColumn={handleAddColumn}
                             />
                          );
                       })}
                  <th
                     className="column__group"
                     onClick={() => setIsOpenAddColumn(!isOpenAddColumn)}
                     ref={dropdownColumn}
                  >
                     <input
                        defaultChecked={false}
                        // onChange={(event) => {
                        //    const isChecked = event.target.checked;
                        //    if (!isChecked) {
                        //       if (listTypeElement.current !== null) {
                        //          listTypeElement.current.style.display = 'none';
                        //       }
                        //    } else {
                        //       if (listTypeElement.current !== null) {
                        //          listTypeElement.current.style.display = 'block';
                        //       }
                        //    }
                        // }}
                        // onBlur={(event) => {
                        //    const isChecked = event.target.checked;
                        //    if (isChecked) {
                        //       if (listTypeElement.current !== null) {
                        //          listTypeElement.current.style.display = 'none';
                        //       }
                        //       event.target.checked = false;
                        //    }
                        // }}
                        className="col__group--check"
                        type="checkbox"
                        id={`plus--col--${data._id}`}
                     />
                     <label className="plus__lable" htmlFor={`plus--col--${data._id}`}>
                        <FontAwesomeIcon icon={faPlus} />
                        <ListType
                           handleAddColumn={handleAddColumn}
                           isOpenAddColumn={isOpenAddColumn}
                           setIsOpenAddColumn={setIsOpenAddColumn}
                        />
                     </label>
                  </th>
               </tr>
            </thead>
            <tbody className="table__data">
               {data.tasks.map((task) => {
                  return (
                     <tr className="table__data-task" key={task._id}>
                        <td className="table__data-task-value">
                           <label htmlFor="checked"></label>
                           <input
                              type="checkbox"
                              id="checked"
                              onChange={(e) => toggleCheckedTask(e, task._id)}
                              data-id={task._id}
                              checked={checkedTasks.includes(task._id)}
                           />
                        </td>
                        <TaskEdit task={task} groupId={data._id} />
                        {filterItem.length > 0
                           ? task.values.map((itemValue, index) => {
                                const colIncludeListValue = columns?.find((col) => {
                                   return (
                                      filterItem.includes(col._id) &&
                                      col._id === itemValue.belongColumn
                                   );
                                });
                                if (colIncludeListValue) {
                                   return (
                                      <ValueTask
                                         key={index}
                                         idBoard={idBoard}
                                         colIncludeListValue={colIncludeListValue}
                                         valueOfTask={itemValue}
                                         task={task}
                                      />
                                   );
                                }
                             })
                           : task.values.map((itemValue, index) => {
                                //   return (
                                //      <ValueTask task={task} valueOfTask={itemValue} key={index} />
                                //   );

                                const colIncludeListValue = columns?.find(
                                   (col) => col._id === itemValue.belongColumn,
                                );

                                if (colIncludeListValue) {
                                   return (
                                      <ValueTask
                                         task={task}
                                         idBoard={idBoard}
                                         valueOfTask={itemValue}
                                         key={index}
                                         colIncludeListValue={colIncludeListValue}
                                      />
                                   );
                                }
                             })}
                     </tr>
                  );
               })}
               <tr className="table__data-task">
                  <td className="table__data-task-value">
                     <label htmlFor="checked"></label>
                     <input type="checkbox" id="checked" />
                  </td>
                  <td className="table__data-add-task">
                     <input
                        type="text"
                        value={valueAddTask}
                        placeholder="Add Task"
                        ref={handleValueAdd}
                        onChange={() => setValueAddTask(handleValueAdd.current?.value)}
                        onBlur={handleAddTask}
                     />
                  </td>
               </tr>
            </tbody>
         </table>
         <MenuTask
            setCheckedTasks={setCheckedTasks}
            tasks={checkedTasks}
            handleDeleteTask={handleDeleteTask}
         />
      </>
   );
};

export default Table;
