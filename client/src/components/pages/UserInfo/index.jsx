import { useEffect, useState } from "react";
import { baseUri, pageNo } from "../../../const";
import Header from "../../organisms/Header";
import Footer from "../../organisms/Footer";
import MessageBox from "../../organisms/MessageBox";

const UserInfo = () => {

  const username = sessionStorage.getItem('username');

  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUri}/getUserInfo`, {
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

        setGender(JSON.parse(json.result)[0].gender);
        setAge(JSON.parse(json.result)[0].age);
        setHeight(JSON.parse(json.result)[0].height);
        setActivityLevel(JSON.parse(json.result)[0].activityLevel);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  },[])

  const handleAge = (e) => {
    let value = e.target.value;
    setAge(value);
  }

  const handleHeight = (e) => {
    let value = e.target.value;
    setHeight(value);
  }

  const submitUserInfo = () => {
    // nonInplements
    alert('すみません。更新機能はまだ実装していません。')
  }

  return (
    <>
      <Header/>
      <div className='pfc-input'>
        <div className='form__input'>
          <span>年齢：</span>
          <label>男</label>
          <input type='radio' value={0} checked={gender===0}/>
          <label>女</label>
          <input type='radio' value={1} checked={gender===1}/>
        </div>
        <div className='form__input'>
          <span>年齢：</span>
          <input className='form__input-sub--long'
                type='number'
                value={ age }
                onChange={ handleAge }
                />
          <span className='form__span'> 歳</span>
        </div>
        <div className='form__input'>
          <span>身長：</span>
          <input className='form__input-sub--long'
                type='number'
                value={ height }
                onChange={ handleHeight }
                />
          <span className='form__span'> cm</span>
        </div>
        <div className='form__input'>
          <span>身体活動レベル：</span><br></br>
          <select>
            <option value={0} selected={activityLevel===0}>ほぼ運動しない。通勤、デスクワーク程度</option>
            <option value={1} selected={activityLevel===1}>軽い運動。週に1～2回程度の運動</option>
            <option value={2} selected={activityLevel===2}>中程度の運動。週に3～5回程度の運動</option>
            <option value={3} selected={activityLevel===3}>激しい運動。週に6～7回程度の運動</option>
            <option value={4} selected={activityLevel===4}>非常に激しい運動。一日に2回程度の運動</option>
          </select>
        </div>
        <button className='form__button' onClick={ submitUserInfo }>更　新</button>
      </div>
      {
        isOpen && (
          <MessageBox message={'登録しました'} closeMethod={ ()=>setIsOpen(false) }/>
        )
      }
      <Footer active={pageNo.inactive}/>
    </>
  );
}

export default UserInfo;