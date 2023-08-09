import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexDiv from "../../atoms/FlexDiv";
import './index.scss';

const WeightInput = () => {

  const navigate = useNavigate();

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');

  const [activeTab, setActiveTab] = useState(0);
  const tabItems = [
    { title: '朝', content: <div></div> },
    { title: '昼', content: <div></div> },
    { title: '夜', content: <div></div> }
  ];

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

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

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
        time: activeTab,
        weight: weight
      })
    });

    const json = await response.json();

    navigate('/WeightInquiry');
  }

  return (
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
          {tabItems.map((item, index) => (
            <div
              key={index}
              className={`form__radio-button ${index === activeTab ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {item.title}
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
  );
}

export default WeightInput;