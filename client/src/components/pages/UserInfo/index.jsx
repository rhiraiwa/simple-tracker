import { useEffect, useState } from "react";
import { ACTIVITY_LEVEL_MAP, ADDITIONAL_CORRECT_MAP, AGE_CORRECT_MAP, HEIGHT_CORRECT_MAP, WEIGHT_CORRECT_MAP, baseUri, pageNo } from "../../../const";
import Header from "../../organisms/Header";
import Footer from "../../organisms/Footer";
import MessageBox from "../../organisms/MessageBox";
import logout from '../../../img/logout_white.png';
import { Link } from "react-router-dom";
import './index.scss';

const UserInfo = () => {

  const username = sessionStorage.getItem('username');

  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  const [weight, setWeight] = useState(0);

  const [bmr, setBmr] = useState('');
  const [tdee, setTdee] = useState('');

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
        setActivityLevel(JSON.parse(json.result)[0].activity_level);
        setWeight(json.weight);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  },[])

  useEffect(() => {
    let wBmr = WEIGHT_CORRECT_MAP[gender] * weight + HEIGHT_CORRECT_MAP[gender] * height - AGE_CORRECT_MAP[gender] * age + ADDITIONAL_CORRECT_MAP[gender];
    let wTdee = wBmr * ACTIVITY_LEVEL_MAP[activityLevel];

    setBmr(wBmr);
    setTdee(wTdee);
  },[gender, height, age, activityLevel]);

  const handleAge = (e) => {
    let value = e.target.value;
    setAge(value);
  }

  const handleHeight = (e) => {
    let value = e.target.value;
    setHeight(value);
  }

  const submitUserInfo = async () => {
    try {
      await fetch(`${baseUri}/userInfoUpdate`, {
        credentials:'include',
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: username,
          gender: gender,
          height: height,
          age: age,
          activityLevel: activityLevel
        })
      });

    } catch (error) {
      console.error('Fetch error:', error);
    }

    setIsOpen(true);
  }

  return (
    <>
      <Header/>
      <div className='user-info'>
        <div className='user-info-name'>
          <h2>{username}</h2>
          <div className='user-logout'>
            <Link to='/' className='user-logout__link'>
              <img className='user-logout__icon' src={ logout } alt='logout'/>
              <span className='user-logout__span'>ログアウト</span>
            </Link>
          </div>
        </div>
        <div className='form__input'>
          <span>性別：</span>
          <input type='radio' value={0} checked={gender===0} onClick={()=>setGender(0)} onChange={()=>{}}/>
          <label>男</label>
          <input type='radio' value={1} checked={gender===1} onClick={()=>setGender(1)} onChange={()=>{}}/>
          <label>女</label>
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
          <span>身体活動レベル：</span>
          <select className='form__select'
                  value={activityLevel}
                  onChange={(e)=>setActivityLevel(e.target.value)}>
            <option value={0}>通勤、デスクワーク程度</option>
            <option value={1}>週に1～2回程度の運動</option>
            <option value={2}>週に3～5回程度の運動</option>
            <option value={3}>週に6～7回程度の運動</option>
            <option value={4}>一日に2回程度の運動</option>
          </select>
        </div>
        <div className='calc-values'>
          <div className='calc-value'>
            <span>基礎代謝量：</span>
            <span>{ `${Math.round(bmr).toLocaleString()} kcal` }</span>
          </div>
          <div className='calc-value'>
            <span>活動代謝量：</span>
            <span>{ `${Math.round(tdee).toLocaleString()} kcal` }</span>
          </div>
        </div>
        <button className='form__button' onClick={ submitUserInfo }>更　新</button>
      </div>
      {
        isOpen && (
          <MessageBox message={'更新しました'} closeMethod={ ()=>setIsOpen(false) }/>
        )
      }
      <Footer active={pageNo.inactive}/>
    </>
  );
}

export default UserInfo;