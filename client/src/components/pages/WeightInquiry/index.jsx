import React, { useEffect, useState } from 'react';
import Header from '../../organisms/Header';
import LineChartComponent from '../../templates/LineChartComponent';
// import filter from '../../../img/filter_primary-blue.png';
import { baseUri } from '../../../const'
import './index.scss';

const WeightInquiry = () => {
  const [weight, setWeight] = useState([]);
  
  const [activeTab, setActiveTab] = useState(0);
  const tabItems = [
    { title: '体重', content: <LineChartComponent data={ weight } dataKey1='weight' dataKey2='weight_average' dataKey3='weight_goal'/> },
    { title: '体脂肪率', content: <LineChartComponent data={ weight } dataKey1='bodyFatPercentage' dataKey2='BFP_average' dataKey3=''/> }
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUri}/inquiry`, {
          credentials: 'include',
          mode: 'cors',
          method: 'POST'
        });
  
        const json = await response.json();
        setWeight(json.result);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Header/>
      <div className='tab'>
        <div className='tab__index'>
          {tabItems.map((item, index) => (
            <div
              key={index}
              className={`tab__index--item ${index === activeTab ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {item.title}
            </div>
          ))}
        </div>
        <div className="tab__content">
          {tabItems[activeTab].content}
        </div>
        <div className='tab__filter'>
          {/* <img className='tab__filter-icon' src={ filter } alt='filter'/> */}
          {/* <div>
            <input type='checkbox' />
            <label>２週間平均値</label>
          </div>
          <div>
            <input type='checkbox' />
            <label>測定値</label>
          </div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default WeightInquiry;