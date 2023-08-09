import React, { useEffect, useState } from "react";
import Header from "../../organisms/Header";
import './index.scss';

const WeightInput = () => {

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');

  const [selectedRadio, setSelectedRadio] = useState(0);
  const radioButtons = ['朝', '昼', '夜'];

  const [weight, setWeight] = useState('');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = ('0'+(today.getMonth()+1)).slice(-2);
    const dd = ('0'+(today.getDate())).slice(-2);
    const time = today.getHours()

    if (4 < time && time < 11) setSelectedRadio(0);
    else if (4 < time && time < 16) setSelectedRadio(1);
    else setSelectedRadio(2);

    setYear(yyyy);
    setMonth(mm);
    setDate(dd);
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

  const handleRadioClick = (index) => {
    setSelectedRadio(index);
  };

  const handleWeight = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 5) return;
    setWeight(value);
  }

  const submitWeight = async () => {
    await fetch('http://localhost:5000/input', {
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
        time: selectedRadio,
        weight: weight
      })
    });

    alert('登録しました');
  }

  return (
    <React.Fragment>
      <Header/>
      <div className='form'>
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
          <div className='form__radio'>
            {radioButtons.map((item, index) => (
              <div
                key={index}
                className={`form__radio-button ${index === selectedRadio ? 'active' : ''}`}
                onClick={() => handleRadioClick(index)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className='form__input'>
          <input className='form__input-main'
                type='number'
                value={ weight }
                onChange={ handleWeight }
                />
          <span className='form__unit'>kg</span>
        </div>
        <button className='form__button' onClick={ submitWeight }>登　録</button>
      </div>
    </React.Fragment>
  );
}

export default WeightInput;