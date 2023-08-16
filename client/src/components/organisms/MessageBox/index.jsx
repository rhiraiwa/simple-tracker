import React from 'react';
import Modal from '../../molecules/Modal';
import './index.scss';

const MessageBox= ({ message, closeMethod }) => {
  return (
    <Modal>
        <div className='message-box'>
          <span className='message-box__text'>{ message }</span>
          <button className='message-box__button' onClick={ closeMethod }>OK</button>
        </div>
    </Modal>
  );
}

export default MessageBox;