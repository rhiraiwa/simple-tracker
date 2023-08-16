import React from 'react';
import Modal from '../../molecules/Modal';
import './index.scss';

const UpdateBox= ({ message, closeMethod }) => {
  return (
    <Modal>
        <div className='update-box'>
          <span className='update-box__text'>{ message }</span>
          <input type='text'/>
          <button className='update-box__button' onClick={ closeMethod }>OK</button>
        </div>
    </Modal>
  );
}

export default UpdateBox;