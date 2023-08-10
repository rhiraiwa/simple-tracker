import React, { useEffect, useState } from 'react';
import Header from '../../organisms/Header';
import LineChartComponent from '../../templates/LineChartComponent';
import './index.scss';

const WeightInquiry = () => {
  const [weight, setWeight] = useState([]);
  
  const [activeTab, setActiveTab] = useState(0);
  const tabItems = [
    { title: '２週間平均値', content: <LineChartComponent data={ weight } dataKey='average'/> },
    { title: '測定値', content: <LineChartComponent data={ weight } dataKey='weight'/> }
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/inquiry', {
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
      </div>
    </React.Fragment>
  );
}

export default WeightInquiry;