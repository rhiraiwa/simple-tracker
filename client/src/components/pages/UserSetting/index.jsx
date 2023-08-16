import React, { useEffect, useState } from 'react';
import { baseUri } from '../../../const';
import Header from '../../organisms/Header';
import reload from '../../../img/reload_primary_blue.png';
import MessageBox from '../../organisms/MessageBox';
import './index.scss';

const UserSetting = () => {

  const username = sessionStorage.getItem('username');
  const [goal, setGoal] = useState('');
  
  const [isOpen, setIsOpen] = useState(false);

  useEffect( () => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUri}/getGoal`, {
          credentials: 'include',
          mode: 'cors',
          method: 'POST',
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            username: username
          })
        });
  
        const json = await response.json();

        if (json.result === null) return;

        setGoal(json.result);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  }, []);

  const handleGoal = (e) => {
    const value = e.target.value;
    setGoal(value);
  }

  const submitGoal = async () => {
    try {
      await fetch(`${baseUri}/setGoal`, {
        credentials: 'include',
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: username,
          goal: goal
        })
      });
    } catch (error) {
      console.error('Fetch error:', error);
    }
    
    setIsOpen(true);
  }

  return (
    <React.Fragment>
      <Header/>
      <div className='user-setting'>
        <div className='user-goal'>
          <label className='user-goal__label'>目標</label>
          <input className='user-goal__input'
                 value={ goal }
                 onChange={ handleGoal }
                 type='number'
                 />
          <span className='user-goal__unit'>kg</span>
          <img className='user-goal__icon'
               onClick={ submitGoal }
               src={ reload }
               alt='reload'/>
        </div>
      </div>
      {
        isOpen && (
          <MessageBox message={'目標値を変更しました'} closeMethod={ ()=>setIsOpen(false) }/>
        )
      }
    </React.Fragment>
  );
}

export default UserSetting;