import React, { useEffect, useState } from 'react';
import { baseUri } from '../../../const';
import Header from '../../organisms/Header';
import reload from '../../../img/reload_primary_blue.png';
import MessageBox from '../../organisms/MessageBox';
import Footer from '../../organisms/Footer';
import './index.scss';

const UserSetting = () => {

  const username = sessionStorage.getItem('username');
  const [weightGoal, setWeightGoal] = useState('');
  const [BFPGoal, setBFPGoal] = useState('');
  
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
        // console.log(JSON.parse(json.result)[0].weight_goal);

        setWeightGoal(JSON.parse(json.result)[0].weight_goal);
        setBFPGoal(JSON.parse(json.result)[0].BFP_goal);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  }, []);

  const handleWeightGoal = (e) => {
    const value = e.target.value;
    setWeightGoal(value);
  }

  const handleBFPGoal = (e) => {
    const value = e.target.value;
    setBFPGoal(value);
  }

  const submitWeightGoal = async () => {
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
          goal: weightGoal,
          target: 'weight_goal'
        })
      });
    } catch (error) {
      console.error('Fetch error:', error);
    }
    
    setIsOpen(true);
  }

  const submitBFPGoal = async () => {
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
          goal: BFPGoal,
          target: 'BFP_goal'
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
          {/* <label className='user-goal__label'>体重</label> */}
          <input className='user-goal__input'
                 value={ weightGoal }
                 onChange={ handleWeightGoal }
                 type='number'
                 />
          <span className='user-goal__unit'>kg</span>
          <img className='user-goal__icon'
               onClick={ submitWeightGoal }
               src={ reload }
               alt='reload'/>
        </div>
        <div className='user-goal'>
          <input className='user-goal__input'
                type='number'
                value={ BFPGoal }
                onChange={ handleBFPGoal }
                />
          <span className='user-goal__unit'> %</span>
          <img className='user-goal__icon'
                onClick={ submitBFPGoal }
                src={ reload }
                alt='reload'/>
        </div>
      </div>
      {
        isOpen && (
          <MessageBox message={'目標値を変更しました'} closeMethod={ ()=>setIsOpen(false) }/>
        )
      }
      <Footer active={0}/>
    </React.Fragment>
  );
}

export default UserSetting;