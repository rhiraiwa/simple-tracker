import React, { useEffect, useState } from 'react';
import { baseUri } from '../../../const';
import Header from '../../organisms/Header';
import MessageBox from '../../organisms/MessageBox';
import Footer from '../../organisms/Footer';
import './index.scss';

const PFCInput = () => {
  
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  const [calorie, setCalorie] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbohydrate, setCarbohydrate] = useState('');

  const [note, setNote] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = ('0'+(today.getMonth()+1)).slice(-2);
    const dd = ('0'+(today.getDate())).slice(-2);
    const hour = today.getHours();
    const minute = today.getMinutes();

    setYear(yyyy);
    setMonth(mm);
    setDate(dd);
    setHour(hour);
    setMinute(minute);
  }, []);

  const handleYear = (e) => {
    const value = e.target.value.replace('.', '');

    if (value.length > 4) return;
    setYear(value);
  }

  const handleMonth = (e) => {
    const value = e.target.value.replace('.', '');

    if (value > 12) return;
    setMonth(value);
  }

  const handleDate = (e) => {
    const value = e.target.value.replace('.', '');

    // より詳細な入力チェックを入るつもり（30 or 31）
    if (value > 31) return;
    setDate(value);
  }

  const handleHour = (e) => {
    const value = e.target.value.replace('.', '');

    if (value > 24) return;
    setHour(value);
  }

  const handleMinute = (e) => {
    const value = e.target.value.replace('.', '');
    
    if (value > 60) return;
    setHour(value);
  }

  const handleCalorie = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setCalorie(value);
  }

  const handleProtein = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setProtein(value);
  }

  const handleFat = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setFat(value);
  }

  const handleCarbohydrate = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setCarbohydrate(value);
  }

  const handleNote = (e) => {
    const value = e.target.value;

    if (value.length > 200) {
      alert('上限200文字です');
      return;
    }

    setNote(value);
  }

  const submitPFC = async () => {
    try {
      await fetch(`${baseUri}/pfcInput`, {
        credentials:'include',
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          year: year,
          month: month,
          date: date,
          hour: hour,
          minute: minute,
          calorie: calorie,
          protein: protein !== null ? protein : '',
          fat: fat !== null ? fat : '',
          carbohydrate: carbohydrate !== null ? carbohydrate : '',
          note: note !== null ? note : ''
        })
      });

    } catch (error) {
      console.error('Fetch error:', error);
    }

    clear();
    setIsOpen(true);
  }

  const clear = () => {
    setCalorie('');
    setProtein('');
    setFat('');
    setCarbohydrate('');
    setNote('');
  }

  return (
    <React.Fragment>
      <Header/>
      <div className='pfc-input'>
        <div className='form__input'>
          <input className='form__input-sub--long'
                type='number'
                value={ year }
                onChange={ handleYear }
                />
          <span className='form__span'>年</span>
          <input className='form__input-sub--short'
                type='number'
                value={ month }
                onChange={ handleMonth }
                />
          <span className='form__span'>月</span>
          <input className='form__input-sub--short'
                type='number'
                value={ date }
                onChange={ handleDate }
                />
          <span className='form__span'>日</span>
        </div>
        <div className='form__input'>
          <input className='form__input-sub--short'
                type='number'
                value={ hour }
                onChange={ handleHour }
                />
          <span className='form__span'>時</span>
          <input className='form__input-sub--short'
                type='number'
                value={ minute }
                onChange={ handleMinute }
                />
          <span className='form__span'>分</span>
        </div>
        <div className='form__input'>
          <input className='form__input-main'
                 value={ calorie }
                 onChange={ handleCalorie }
                 type='number'
                 />
          <span className='form__unit'>kCal</span>
        </div>
        <div className='form__input'>
          <span>P（タンパク質）：</span>
          <input className='form__input-sub--long'
                type='number'
                value={ protein }
                onChange={ handleProtein }
                />
          <span className='form__span'> g</span>
        </div>
        <div className='form__input'>
          <span>　　　F（脂質）：</span>
          <input className='form__input-sub--long'
                type='number'
                value={ fat }
                onChange={ handleFat }
                />
          <span className='form__span'> g</span>
        </div>
        <div className='form__input'>
          <span>　C（炭水化物）：</span>
          <input className='form__input-sub--long'
                type='number'
                value={ carbohydrate }
                onChange={ handleCarbohydrate }
                />
          <span className='form__span'> g</span>
        </div>
        <div className='form__input'>
          <textarea className='pfc-note'
            value={ note }
            onChange={ handleNote }
            placeholder='備考'
          />
        </div>
        <button className='form__button' onClick={ submitPFC }>登　録</button>
      </div>
      {
        isOpen && (
          <MessageBox message={'登録しました'} closeMethod={ ()=>setIsOpen(false) }/>
        )
      }
      <Footer/>
    </React.Fragment>
  );
}

export default PFCInput;