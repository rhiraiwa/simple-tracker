import React, { useEffect, useState } from 'react';
import { ACTIVITY_LEVEL_MAP, ADDITIONAL_CORRECT_MAP, AGE_CORRECT_MAP, HEIGHT_CORRECT_MAP, WEIGHT_CORRECT_MAP, baseUri, pageNo } from '../../../const';
import Header from '../../organisms/Header';
import Footer from '../../organisms/Footer';
import CaloriePieChart from '../../templates/CaloriePieChart';
import PFCBarChart from '../../templates/PFCBarChart';
import MealHistoryTable from '../../templates/MealHistoryTable';
import './index.scss';

const TodaysInfo = () => {

  const username = sessionStorage.getItem('username');

  const [yearMonthDate, setYearMonthDate] = useState('');

  const [todaysCalorie, setTodaysCalorie] = useState(0);
  const [todaysProtein, setTodaysProtein] = useState(0);
  const [todaysFat, setTodaysFat] = useState(0);
  const [todaysCarbohydrate, setTodaysCarbohydrate] = useState(0);
  const [foodList, setFoodList] = useState([]);

  const [bmr, setBmr] = useState(0);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const getToday = async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = ('0'+(today.getMonth()+1)).slice(-2);
      const dd = ('0'+(today.getDate())).slice(-2);
  
      setYearMonthDate(`${yyyy}/${mm}/${dd}`);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUri}/getUserInfo`, {
          credentials: 'include',
          mode: 'cors',
          method: 'POST',
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            username: username
          })
        });
  
        const json = await response.json();

        if (json.result === null) return;

        let gender = JSON.parse(json.result)[0].gender;
        let age = JSON.parse(json.result)[0].age;
        let height = JSON.parse(json.result)[0].height;
        let activityLevel = JSON.parse(json.result)[0].activity_level;
        let weight = json.weight;

        let wBmr = WEIGHT_CORRECT_MAP[gender] * weight + HEIGHT_CORRECT_MAP[gender] * height - AGE_CORRECT_MAP[gender] * age + ADDITIONAL_CORRECT_MAP[gender];
        let wTdee = wBmr * ACTIVITY_LEVEL_MAP[activityLevel];
  
        setBmr(Math.round(wBmr));
        setLimit(Math.round(wTdee));

      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  },[])

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
          <CaloriePieChart calorie={todaysCalorie} limit={limit} bmr={bmr}/>
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
