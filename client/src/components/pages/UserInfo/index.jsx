import { useState } from "react";
import { pageNo } from "../../../const";
import Header from "../../organisms/Header";
import Footer from "../../organisms/Footer";
import MessageBox from "../../organisms/MessageBox";

const UserInfo = () => {

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');

  const [isOpen, setIsOpen] = useState(false);

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
  }

  return (
    <>
      <Header/>
      <div className='pfc-input'>
        <div className='form__input'>
          <span>年齢：</span>
          <label>男</label>
          <input type='radio' value={0}/>
          <label>女</label>
          <input type='radio' value={1}/>
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
            <option value={0}>ほぼ運動しない。通勤、デスクワーク程度</option>
            <option value={1}>軽い運動。週に1～2回程度の運動</option>
            <option value={2}>中程度の運動。週に3～5回程度の運動</option>
            <option value={3}>激しい運動。週に6～7回程度の運動</option>
            <option value={4}>非常に激しい運動。一日に2回程度の運動</option>
          </select>
        </div>
        <button className='form__button' onClick={ submitUserInfo }>登　録</button>
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