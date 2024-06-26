import React from 'react';
import Sidebar from '~/components/Sidebar/sidebar';
import { IChildrenComponentProps } from '~/shared/model/global';
const LayoutWorkspace: React.FC<IChildrenComponentProps> = ({ children }) => {
   return (
      <div>
         <div className="wrapper" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="content" style={{flex : 1}}>{children}</div>
         </div>
      </div>
   );
};

export default LayoutWorkspace;
