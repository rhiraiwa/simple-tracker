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

  const [yearMonthDate, setYearMonthDate] = useState({
    slash: '',
    hyphen: ''
  });

  const [todaysCalorie, setTodaysCalorie] = useState(0);
  const [todaysProtein, setTodaysProtein] = useState(0);
  const [todaysFat, setTodaysFat] = useState(0);
  const [todaysCarbohydrate, setTodaysCarbohydrate] = useState(0);
  const [foodList, setFoodList] = useState([]);

  const [bmr, setBmr] = useState(0);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    getDateWithOffset(0);
    fetchUserInfo();
  },[]);

  useEffect(()=> {
    if (yearMonthDate.slash === '' && yearMonthDate.hyphen === '') return;
    fetchData();
  },[yearMonthDate]);

  const getDateWithOffset = (days) => {
    const date = days === 0 ? new Date() : new Date(yearMonthDate.hyphen);
    const modifiedDate = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const yyyy = modifiedDate.getFullYear();
    const mm = String(modifiedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(modifiedDate.getDate()).padStart(2, '0');
    setYearMonthDate({...yearMonthDate, ['slash']: `${yyyy}/${mm}/${dd}`
                                      , ['hyphen']: `${yyyy}-${mm}-${dd}`});
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUri}/todaysInfo`, {
        credentials: 'include',
        mode: 'cors',
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          yearmonthdate: yearMonthDate.hyphen
        })
      });
      
      const json = await response.json();

      let [cal, p, f, c] = [0, 0, 0, 0];

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

  const fetchUserInfo = async () => {
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

      let wBmr = WEIGHT_CORRECT_MAP[gender] * weight +
                 HEIGHT_CORRECT_MAP[gender] * height -
                 AGE_CORRECT_MAP[gender] * age +
                 ADDITIONAL_CORRECT_MAP[gender];
                 
      let wTdee = wBmr * ACTIVITY_LEVEL_MAP[activityLevel];

      setBmr(Math.round(wBmr));
      setLimit(Math.round(wTdee));

    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  return (
    <React.Fragment>
      <Header/>
      <div className='todays-info'>
        <div className='container-title-date'>
          <span onClick={() => getDateWithOffset(-1)}>◀</span>
          <label>{yearMonthDate.slash}</label>
          <span onClick={() => getDateWithOffset(1)}>▶</span>
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
