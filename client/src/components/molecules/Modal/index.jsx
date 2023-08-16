import React from 'react';
import './index.scss';

const Modal= ({ children }) => {
  return (
    <React.Fragment>
      <div className='background-layer'></div>
      <div className='forward-layer'>
        { children }
      </div>
    </React.Fragment>
  );
}

export default Modal;