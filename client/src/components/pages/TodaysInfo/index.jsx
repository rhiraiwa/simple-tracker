import React, { useEffect, useState } from 'react';
import { baseUri, pageNo } from '../../../const';
import Header from '../../organisms/Header';
import Footer from '../../organisms/Footer';
import CaloriePieChart from '../../templates/CaloriePieChart';
import PFCBarChart from '../../templates/PFCBarChart';
import MealHistoryTable from '../../templates/MealHistoryTable';
import './index.scss';

const TodaysInfo = () => {

  const [yearMonthDate, setYearMonthDate] = useState('');

  const [todaysCalorie, setTodaysCalorie] = useState(0);
  const [todaysProtein, setTodaysProtein] = useState(0);
  const [todaysFat, setTodaysFat] = useState(0);
  const [todaysCarbohydrate, setTodaysCarbohydrate] = useState(0);
  const [foodList, setFoodList] = useState([]);

  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const getToday = async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = ('0'+(today.getMonth()+1)).slice(-2);
      const dd = ('0'+(today.getDate())).slice(-2);
  
      setYearMonthDate(`${yyyy}/${mm}/${dd}`);
    }

    const calcLimit = async (weight) => {
      // 性別・年齢・身長・身体活動レベルが固定
      //（9.247×体重kg＋3.098×身長cm−4.33×年齢+447.593）基礎代謝 * 軽い運動
      let wLimit =Math.round(((9.247*weight) + (3.098*161.5) - (4.33*30) +447.593) * 1.2 )
      setLimit(wLimit);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUri}/todaysInfo`, {
          credentials: 'include',
          mode: 'cors',
          method: 'POST'
        });
        
        const json = await response.json();

        let cal = 0;
        let p = 0;
        let f = 0;
        let c = 0;

        for (let i = 0; i < json.result.length; i++) {
          cal += Number(json.result[i].calorie);
          p += Number(json.result[i].protein);
          f += Number(json.result[i].fat);
          c += Number(json.result[i].carbohydrate);
        }

        calcLimit(json.weight);

        setTodaysCalorie(cal);
        setTodaysProtein(p);
        setTodaysFat(f);
        setTodaysCarbohydrate(c);
        setFoodList(json.result);
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    getToday();
    fetchData();
  },[]);

  return (
    <React.Fragment>
      <Header/>
      <div className='todays-info'>
        <div className='container-title-date'>
         <label>{yearMonthDate}</label>
        </div>
        <div className='container-title'>
         <label>カロリー・PFC</label>
        </div>
        <div className='calorie-responsive-container'>
          <CaloriePieChart calorie={todaysCalorie} limit={limit}/>
        </div>
        <div className='pfc-responsive-container'>
          <PFCBarChart p={todaysProtein} f={todaysFat} c={todaysCarbohydrate}/>
        </div>
        <div className='container-title'>
          <label>食事履歴</label>
        </div>
        <MealHistoryTable mealList={foodList}/>
      </div>
      <Footer active={pageNo.todaysInfo}/>
    </React.Fragment>
  );
}

export default TodaysInfo;
