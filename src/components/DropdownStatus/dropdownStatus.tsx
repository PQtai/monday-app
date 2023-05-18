import './dropdownStatus.scss';
import { useEffect, useRef, useState } from 'react';
import icons from '~/assets/svg/index';
import InputEdit from './InputEdit/inputEdit';
import { IColors, colorsData } from './ColorEdit/colorsData';
import axios from 'axios';
import { SERVER_API_URL } from '~/config/constants';
import { useParams } from 'react-router-dom';
interface IDropdownStatusProps {
   isOpen: boolean;
   setOpenStatusBox: (isopen: boolean) => void;
   setChangeStatus: (value: {}) => void;
   listStatus: any[];
   columnID:string
}
const DropdownStatus = ({
   isOpen,
   setOpenStatusBox,
   setChangeStatus,
   listStatus,
   columnID
}: IDropdownStatusProps) => {
   const {idBoard} = useParams()
   
   
   const [isEdit, setIsEdit] = useState(false);
   const [listStatusState, setListStatusState] = useState(listStatus);
   const [colorsIsSamp, setColorsIsSamp] = useState(listStatus);
   useEffect(() => {
      setListStatusState(listStatus);
      setColorsIsSamp(listStatus);
   }, [listStatus]);
   const handleEditStatus = () => {
      setOpenStatusBox(false);
      setIsEdit((pre) => !pre);
   };
   const handleChangeStatus = (e: any, value: string) => {
      setChangeStatus({
         value,
         color: e.currentTarget.dataset.color,
      });
   };

   const handleAddValueStatus = async () => {
      
      const ColorsNoSame = colorsData.filter((color) => !colorsIsSamp.includes(color));
      const randomColor = ColorsNoSame[Math.floor(Math.random() * ColorsNoSame.length)];
      setColorsIsSamp((pre) => [...pre, randomColor]);
      const { color } = randomColor;
      const res = await axios.post(
         `${SERVER_API_URL}v1/api/board/${idBoard}/column/${columnID}/values`,
         { value: null, color },
      );
      setListStatusState((pre) => [
         ...pre,
         {
            _id: res.data.metadata.value._id,
            color,
            value: '',
         },
      ]);

      
      
   };
   return (
      <>
         {isOpen && (
            <div className="status__wrapper" onClick={() => setOpenStatusBox(false)}>
               <div className="status__wrapper-flex">
                  <div
                     className="list__status"
                     style={isEdit ? { display: 'none' } : { display: 'block' }}
                  >
                     {listStatusState.map((item) => {
                        return (
                           <div
                              className="status__item"
                              style={{ backgroundColor: item.color ? item.color :'#797e93'}}
                              data-color={item.color ? item.color : '#797e93'}
                              onClick={(e) => handleChangeStatus(e, item.value)}
                           >
                              <span className="status__item-title">{item.value}</span>
                           </div>
                        );
                     })}
                  </div>
                  <div
                     className="list__status-input"
                     style={isEdit ? { display: 'block' } : { display: 'none' }}
                  >
                     {listStatusState.map((item) => {
                        return <InputEdit data={item} key={item._id} setListStatusState={setListStatusState}/>;
                     })}
                     {isEdit && (
                        <div className="item__add-status" onClick={handleAddValueStatus}>
                           <span>+ Add new label</span>
                        </div>
                     )}
                  </div>
               </div>
               <div className="status__edit-wrapper" onClick={handleEditStatus}>
                  {!isEdit ? (
                     <div className="status__edit-btn">
                        <img src={icons.edit} alt="" />
                        <span className="status__item-title">Edit labels</span>
                     </div>
                  ) : (
                     <div className="status__edit-btn">
                        <span className="status__item-title">Apply</span>
                     </div>
                  )}
               </div>
            </div>
         )}
      </>
   );
};

export default DropdownStatus;
