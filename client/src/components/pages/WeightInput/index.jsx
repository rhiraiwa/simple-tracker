import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexDiv from "../../atoms/FlexDiv";
import './index.scss';

const WeightInput = () => {

  const navigate = useNavigate();

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');

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

  const handleWeight = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 5) return;
    setWeight(value);
  }

  const submitWeight = async () => {
    const response = await fetch('http://localhost:5000/input', {
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
        weight: weight
      })
    });

    const json = await response.json();

    navigate('/WeightInquiry');
  }

  return (
    <div className='form'>
      <FlexDiv className='form__input'>
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
      </FlexDiv>
      <FlexDiv className='form__input'>
        <input className='form__input-main'
              type='number'
              value={ weight }
              onChange={ handleWeight }
              />
        <span className='form__unit'>kg</span>
      </FlexDiv>
      <button className='form__button' onClick={ submitWeight }>登録</button>
    </div>
  );
}

export default WeightInput;