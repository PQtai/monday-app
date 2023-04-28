import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import './group.scss';
import { useState } from 'react';
import Tippy from '../Tippy';
import HeaderTable from './headerTable';
import Row from '../Row';
const Group = () => {
   const [valueNameInput, setValueNameInput] = useState<string>('Group Title');
   const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      setValueNameInput(target.value);
   };

   //    const dataGroup = [
   //     {
   //         col : 'item',
   //         data : [

   //         ]
   //     }
   //    ]

   return (
      <div className="group">
         <div className="group__head">
            <button className="head__btn--option">
               <FontAwesomeIcon icon={faEllipsis} />
            </button>
            <div className="head__input--wrap">
               <Tippy position="top" html={<p>Collapse group</p>}>
                  <FontAwesomeIcon className="input--icon" icon={faAngleDown} />
               </Tippy>

               <Tippy position="top" html={<p>Click to edit</p>}>
                  <input
                     onChange={(e) => {
                        handleChangeValue(e);
                     }}
                     className="input__group"
                     type="text"
                     value={valueNameInput}
                  />
               </Tippy>
            </div>
         </div>
         <div className="group__table">
            <HeaderTable />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
            <Row />
         </div>
      </div>
   );
};

export default Group;
