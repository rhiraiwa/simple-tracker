import React, { useEffect, useState } from 'react';
import { baseUri } from '../../../const'
import Header from '../../organisms/Header';
import LineChartComponent from '../../templates/LineChartComponent';
import Footer from '../../organisms/Footer';
import './index.scss';

const WeightInquiry = () => {
  const [weight, setWeight] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  
  const [activeTab, setActiveTab] = useState(0);
  const tabItems = [
    { title: '体重', content: <LineChartComponent data={ displayData } dataKey1='weight' dataKey2='weight_average' dataKey3='weight_goal'/> },
    { title: '体脂肪率', content: <LineChartComponent data={ displayData } dataKey1='bodyFatPercentage' dataKey2='BFP_average' dataKey3='BFP_goal'/> },
    { title: 'PFC', content: <LineChartComponent data={ displayData } dataKey1='calorie' dataKey2='' dataKey3=''/> } 
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [selectedRadio, setSelectedRadio] = useState(0);
  const radioButtons = ['過去２週間', '過去１ヶ月', '全データ'];

  const handleRadioClick = (index) => {
    setSelectedRadio(index);
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

  useEffect(() => {
    // 今日の日付を取得
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10); // ISO形式の日付に変換
  
    // 期間の開始日を計算する関数
    const calculateStartDate = (days) => {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - days); // 指定された日数を引く
      return startDate.toISOString().slice(0, 10); // ISO形式の日付に変換
    };
  
    const twoWeeksAgoISO = calculateStartDate(14);
    const monthAgoISO = calculateStartDate(30);
  
    if (selectedRadio === 2) {
      setDisplayData(weight);
      return;
    }
  
    // フィルタリング処理
    const filteredData = weight.filter((item) => {
      const itemDate = item.date;
      switch (selectedRadio) {
        case 0:
          return itemDate >= twoWeeksAgoISO && itemDate <= todayISO;
        case 1:
          return itemDate >= monthAgoISO && itemDate <= todayISO;
        default:
          return false;
      }
    });
  
    setDisplayData(filteredData);
  }, [weight, selectedRadio]);  

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
          <div className='filter__radio'>
            {radioButtons.map((item, index) => (
              <div
                key={index}
                className={`filter__radio-button ${index === selectedRadio ? 'active' : ''}`}
                onClick={() => handleRadioClick(index)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </React.Fragment>
  );
}

export default WeightInquiry;