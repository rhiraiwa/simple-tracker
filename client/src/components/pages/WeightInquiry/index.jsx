import React, { useEffect, useState } from 'react';
import { baseUri, pageNo } from '../../../const'
import Header from '../../organisms/Header';
import LineChartComponent from '../../templates/LineChartComponent';
import Footer from '../../organisms/Footer';
import './index.scss';

const WeightInquiry = () => {
  const [weight, setWeight] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  
  const [isChecked, setIsChecked] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const tabItems = [
    { title: '体重', content: <LineChartComponent data={ displayData } dataKey1='weight' dataKey2='weight_average' dataKey3='weight_goal' isPrivacyMode={isChecked}/> },
    { title: '体脂肪率', content: <LineChartComponent data={ displayData } dataKey1='bodyFatPercentage' dataKey2='BFP_average' dataKey3='BFP_goal' isPrivacyMode={isChecked}/> },
    { title: 'PFC', content: <LineChartComponent data={ displayData } dataKey1='calorie' dataKey2='' dataKey3='' isPrivacyMode={isChecked}/> } 
  ];


  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [selectedRadio, setSelectedRadio] = useState(0);
  const radioButtons = ['過去２週間', '過去１ヶ月', '全期間'];

  const handleRadioClick = (index) => {
    setSelectedRadio(index);
  };
  
  const handleToggle = () => {
    setIsChecked(!isChecked);
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
    const todayJST = new Date(today.getTime() + 9 * 60 * 60 * 1000); // 日本時間に変換
    
    // 期間の開始日を計算する関数
    const calculateStartDate = (days) => {
      const startDate = new Date(todayJST);
      startDate.setDate(todayJST.getDate() - days); // 指定された日数を引く
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
          return itemDate >= twoWeeksAgoISO && itemDate <= todayJST.toISOString().slice(0, 10);
        case 1:
          return itemDate >= monthAgoISO && itemDate <= todayJST.toISOString().slice(0, 10);
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
        
        <div className='toggle-area'>
          <span className='toggle-label'>privacy mode</span>
          <div className='toggle-ribon'>
            <div className={`toggle ${isChecked ? 'checked' : ''}`} onClick={handleToggle}>
              <input className='toggle__input' type='checkbox' checked={isChecked} onChange={()=>{}}/>
              <div className='toggle__track'>
                <div className={`toggle__thumb ${isChecked ? 'checked' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <Footer active={pageNo.weightInquiry}/>
    </React.Fragment>
  );
}

export default WeightInquiry;