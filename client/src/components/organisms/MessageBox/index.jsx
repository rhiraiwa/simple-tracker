import React from 'react';
import './index.scss';

const MessageBox= ({ message, closeMethod }) => {
  return (
    <React.Fragment>
      <div className='background-layer'></div>
      <div className='forward-layer'>
        <div className='message-box'>
          <span className='message-box__text'>{ message }</span>
          <button className='message-box__button' onClick={ closeMethod }>OK</button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MessageBox;