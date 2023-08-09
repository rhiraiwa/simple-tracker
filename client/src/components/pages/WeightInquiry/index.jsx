import React, { useEffect, useState } from 'react';
import LineChartComponent from '../../templates/LineChartComponent';
import './index.scss';
import Header from '../../organisms/Header';

const WeightInquiry = () => {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState([]);
  const [average, setAverage] = useState([]);
  
  const [activeTab, setActiveTab] = useState(0);
  const tabItems = [
    { title: '２週間平均値', content: <LineChartComponent data={ average }/> },
    { title: '測定値', content: <LineChartComponent data={ weight }/> }
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
        setAverage(json.result.average);
        setWeight(json.result.weight);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Header/>
      {/* <div className='graph'> */}
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
      {/* </div> */}
    </React.Fragment>
  );
}

export default WeightInquiry;