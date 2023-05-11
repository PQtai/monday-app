import { Dropdown, MenuProps } from 'antd';
import './boardSidebar.scss';
import Tippy from '../Tippy';
import { MouseEvent, useState } from 'react';

import images from '~/assets/svg';
import { useAppDispatch, useAppSelector } from '~/config/store';
import { deleteBoard, editBoard } from '~/pages/Board/board.reducer';
import { IBoard } from '~/shared/model/board';
import { useNavigate, useParams } from 'react-router-dom';

const { edit, coppy, deleteIcon, move, iconBoard } = images;

interface IPropsBoardSidebar {
   dataBoard: IBoard;
}

const BoardSidebar = ({ dataBoard }: IPropsBoardSidebar) => {
   const [valueInput, setValueInput] = useState<string>(dataBoard.name);
   const [isEditInput, setIsEditInput] = useState<boolean>(false);
   const [visible, setVisible] = useState(false);

   const handleOpenChange = (open: boolean) => {
      setVisible((prev) => !prev);
   };
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { idBoard } = useParams();
   const handleEditBoard = (
      e: React.FocusEvent<HTMLInputElement, Element> | React.KeyboardEvent<HTMLInputElement>,
   ) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      if (!target.value) {
         setValueInput('Monday');
      }

      if (target.value !== dataBoard.name) {
         dispatch(
            editBoard({
               idBoard: dataBoard._id,
               name: target.value,
            }),
         );
      }
      setIsEditInput(!isEditInput);
      // call api change name workpace
   };
   const handleDeleteBoard = () => {
      setVisible(false);
      dispatch(deleteBoard({ id: dataBoard._id }));
   };
   const items: MenuProps['items'] = [
      {
         key: '1',
         label: <span>Rename Board</span>,
         icon: <img src={edit} alt="icon-board" />,
         onClick: () => {
            setVisible(false);
            setIsEditInput(true);
         },
      },
      {
         key: '2',
         label: <span>Move to</span>,
         icon: (
            <svg
               viewBox="0 0 20 20"
               fill="currentColor"
               width="16"
               height="16"
               aria-hidden="true"
               aria-label="Move to"
               className="icon_component icon_component--no-focus-style"
            >
               <path
                  d="M2.24999 10.071C2.24999 9.65683 2.58578 9.32104 2.99999 9.32104L15.3315 9.32105L10.7031 4.69273C10.4103 4.39983 10.4103 3.92496 10.7031 3.63207C10.996 3.33917 11.4709 3.33917 11.7638 3.63207L17.6725 9.54071C17.9653 9.83361 17.9653 10.3085 17.6725 10.6014L11.7638 16.51C11.4709 16.8029 10.996 16.8029 10.7031 16.51C10.4103 16.2171 10.4103 15.7423 10.7031 15.4494L15.3315 10.821L2.99999 10.821C2.58578 10.821 2.24999 10.4853 2.24999 10.071Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
               ></path>
            </svg>
         ),
         children: [
            {
               key: '2-1',
               label: 'Move to workspace',
            },
         ],
      },
      {
         key: '3',
         label: <span>Duplicate Board</span>,
         icon: (
            <svg
               viewBox="0 0 20 20"
               fill="currentColor"
               width="16"
               height="16"
               aria-hidden="true"
               aria-label="Duplicate Board"
               className="icon_component icon_component--no-focus-style"
            >
               <path
                  d="M7.82576 3.7273C7.82576 3.58922 7.93769 3.47729 8.07576 3.47729H9.76937H13.1567C13.2184 3.47729 13.278 3.50016 13.3239 3.54147L15.94 5.89592C15.9927 5.94334 16.0227 6.01088 16.0227 6.08175V13.3637C16.0227 13.5017 15.9108 13.6137 15.7727 13.6137H8.07576C7.93769 13.6137 7.82576 13.5017 7.82576 13.3637V3.7273ZM8.07576 1.97729C7.10926 1.97729 6.32576 2.7608 6.32576 3.7273V4.88639H5.16667C4.20017 4.88639 3.41667 5.66989 3.41667 6.63639V16.2727C3.41667 17.2392 4.20018 18.0228 5.16667 18.0228H11.8939C12.8604 18.0228 13.6439 17.2392 13.6439 16.2727V15.1137H15.7727C16.7392 15.1137 17.5227 14.3302 17.5227 13.3637V6.08175C17.5227 5.58565 17.3122 5.11286 16.9434 4.78098L14.3274 2.42653C14.006 2.13732 13.589 1.97729 13.1567 1.97729H9.76937H8.07576ZM12.1439 15.1137H8.07576C7.10927 15.1137 6.32576 14.3302 6.32576 13.3637V6.38639H5.16667C5.0286 6.38639 4.91667 6.49831 4.91667 6.63639V16.2727C4.91667 16.4108 5.0286 16.5227 5.16667 16.5227H11.8939C12.032 16.5227 12.1439 16.4108 12.1439 16.2727V15.1137Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
               ></path>
            </svg>
         ),
      },
      {
         key: '4',
         label: <span>Delete Board</span>,
         icon: (
            <svg
               viewBox="0 0 20 20"
               fill="currentColor"
               width="16"
               height="16"
               aria-hidden="true"
               aria-label="Delete"
               className="icon_component icon_component--no-focus-style"
            >
               <path
                  d="M8.30035 1.86462C7.77994 1.86462 7.29477 2.08976 6.94732 2.46719C6.60179 2.84253 6.41724 3.33927 6.41724 3.84552V4.32642H4.901H2.63477C2.22055 4.32642 1.88477 4.6622 1.88477 5.07642C1.88477 5.49063 2.22055 5.82642 2.63477 5.82642H4.151V16.1545C4.151 16.6608 4.33556 17.1575 4.68109 17.5328C5.02853 17.9103 5.51371 18.1354 6.03411 18.1354H13.9659C14.4863 18.1354 14.9715 17.9103 15.3189 17.5328C15.6645 17.1575 15.849 16.6608 15.849 16.1545V5.82642H17.3652C17.7794 5.82642 18.1152 5.49063 18.1152 5.07642C18.1152 4.6622 17.7794 4.32642 17.3652 4.32642H15.099H13.5828V3.84552C13.5828 3.33927 13.3982 2.84253 13.0527 2.46719C12.7053 2.08976 12.2201 1.86462 11.6997 1.86462H8.30035ZM7.16447 5.82642C7.16539 5.82642 7.16631 5.82642 7.16724 5.82642H12.8328C12.8337 5.82642 12.8346 5.82642 12.8356 5.82642H14.349V16.1545C14.349 16.3012 14.2948 16.4306 14.2153 16.5169C14.1378 16.6012 14.0465 16.6354 13.9659 16.6354H6.03411C5.95348 16.6354 5.86223 16.6012 5.78468 16.5169C5.7052 16.4306 5.651 16.3012 5.651 16.1545V5.82642H7.16447ZM12.0828 4.32642V3.84552C12.0828 3.69887 12.0286 3.56943 11.9491 3.4831C11.8716 3.39886 11.7803 3.36462 11.6997 3.36462H8.30035C8.21972 3.36462 8.12847 3.39886 8.05091 3.4831C7.97144 3.56943 7.91724 3.69887 7.91724 3.84552V4.32642L12.0828 4.32642Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
               ></path>
            </svg>
         ),
      },
   ];

   return (
      <Tippy position="topRight" html={<p>Đây là board</p>}>
         <div
            onClick={(e) => {
               if (!visible) {
                  navigate(`/board/${dataBoard._id}`);
                  setVisible(false);
               }
            }}
            className={`item__board ${dataBoard._id === idBoard ? 'board__info--active' : ''}`}
         >
            <div className={`board__info`}>
               <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="19"
                  height="19"
                  aria-hidden="true"
                  aria-label="Public board"
                  className="board__icon"
               >
                  <path
                     d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z"
                     fill="currentColor"
                     fillRule="evenodd"
                     clipRule="evenodd"
                  ></path>
               </svg>
               {isEditInput ? (
                  <input
                     autoFocus
                     value={valueInput}
                     onChange={(e) => {
                        setValueInput(e.target.value);
                     }}
                     onBlur={handleEditBoard}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           handleEditBoard(e);
                        }
                     }}
                     className="board__title--input"
                  />
               ) : (
                  <span className="board__title">{valueInput}</span>
               )}
            </div>
            <Dropdown onOpenChange={handleOpenChange} menu={{ items }}>
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                  }}
                  className="board__btn--dot"
               >
                  ...
               </button>
            </Dropdown>
         </div>
      </Tippy>
   );
};

export default BoardSidebar;
