import React, { useEffect, useState } from 'react';
import { baseUri } from '../../../const';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import Header from '../../organisms/Header';
import Footer from '../../organisms/Footer';
import './index.scss';

const TodaysInfo = () => {

  const [todaysCalorie, setTodaysCalorie] = useState(0);
  const [todaysProtein, setTodaysProtein] = useState(0);
  const [todaysFat, setTodaysFat] = useState(0);
  const [todaysCarbohydrate, setTodaysCarbohydrate] = useState(0);
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
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

    fetchData();
  },[])

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const RADIAN = Math.PI / 180;
  const calorie = [
    { name: 'sectionOne', value: 500, line: '250',  color: '#a4c4e1' },
    { name: 'sectionTwo', value: 500, line: '750', color: '#a4c4e1' },
    { name: 'sectionThree', value: 500, line: '1,250', color: '#a4c4e1' }
  ];
  const cx = screenWidth / 2 - 4;
  const cy = screenHeight / 4;
  const iR = screenWidth / 2 - 30;
  const oR = screenWidth / 2 - 28;
  const value = todaysCalorie; // ニードルの位置を示す値

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;
    const yc = y0 - length * 0.5;

    return (
      <>
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />
        <text className='calorie-value' x={x0} y={yc} textAnchor="middle" fill="#f1d6df" >{`${todaysCalorie.toLocaleString()} kcal`}</text>
      </>
    );
  };
  
  const data = [
    { category: 'P（タンパク質）', target: 60, achievement: todaysProtein },
    { category: 'F（脂質）', target: 45, achievement: todaysFat },
    { category: 'C（炭水化物）', target: 180, achievement: todaysCarbohydrate },
  ];

  const chartData = data.map((entry) => ({
    category: entry.category,
    target: entry.target,
    achievement: entry.achievement,
    result: entry.achievement > entry.target ? 100 : 100 - (entry.target - entry.achievement) * 100 / entry.target,
    over: entry.achievement > entry.target ? (entry.achievement - entry.target) * 100 / entry.target : 0,
    under: entry.achievement > entry.target ? 0 : (entry.target - entry.achievement) * 100 / entry.target
  }));

  const renderCustomizedLabelLine = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
    // ラベルラインの始点を弧の終点に設定
    const startRadius = outerRadius; // 弧の外周
    const endRadius = outerRadius + 15; // ラベルラインの終点をセルの外側に設定する値
    const startX = cx + startRadius * Math.cos(-midAngle * (Math.PI / 180)) ;
    const startY = cy + startRadius * Math.sin(-midAngle * (Math.PI / 180)) ;
    const endX = cx + endRadius * Math.cos(-midAngle * (Math.PI / 180)) ;
    const endY = cy + endRadius * Math.sin(-midAngle * (Math.PI / 180)) ;
  
    return (
      <>
        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#a4c4e1" />
        <text x={endX} y={endY} dy={-15} textAnchor="middle" fill="#a4c4e1">
          {payload.payload.line}
        </text>
      </>
    );
  };

  return (
    <React.Fragment>
      <Header/>
      <div className='todays-info'>
        <div className='container-title'>
         <label>カロリー</label>
        </div>
        <div className='custom-responsive-container'>
          <ResponsiveContainer width="100%">
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={calorie}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#a4c4e1"
                stroke='none'
                labelLine={false}
                label={renderCustomizedLabelLine} // ラベルをカスタマイズした関数を指定
                isAnimationActive={false}
              >
                {calorie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {needle(value, calorie, cx, cy, iR, oR, '#ff9999')}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='container-title'>
         <label>PFCバランス</label>
        </div>
        <div className='custom-responsive-container'>
          <ResponsiveContainer width="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis unit='%'/>
              <Tooltip content={CustomTooltip} active={data !== null} payload={data} />
              <Bar dataKey="result" fill="#a4c4e1" stackId="stack" isAnimationActive={false}/>
              <Bar dataKey="over" fill="#f1d6df" stackId="stack" isAnimationActive={false}/>
              <Bar dataKey="under" fill="#a4c4e1" stackId="stack" isAnimationActive={false} opacity={0.1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='container-title'>
          <label>食事履歴</label>
        </div>
        <div className='food-history'>
          <table className='food-history__table'>
            <thead>
              <tr>
                <th className='col-note'></th>
                <th className='col-calorie'>Calorie</th>
                <th className='col-pfc'>P</th>
                <th className='col-pfc'>F</th>
                <th className='col-pfc'>C</th>
                <th className='col-x'></th>
              </tr>
            </thead>
            <tbody>
              {
                foodList.map((food, index) => (
                  <tr>
                    <td className='col-note'>{food.note}</td>
                    <td className='col-calorie'>{food.calorie}</td>
                    <td className='col-pfc'>{food.protein}</td>
                    <td className='col-pfc'>{food.fat}</td>
                    <td className='col-pfc'>{food.carbohydrate}</td>
                    <td className='col-x'></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <Footer active={4}/>
    </React.Fragment>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label-target">{`目標 : ${payload[0].payload.target} g`}</p>
        <p className="label-achievement">{`摂取量 : ${payload[0].payload.achievement} g`}</p>
        {
          payload[0].payload.over > 0 && (
            <p className="label-over">{`超過 : ${payload[0].payload.achievement - payload[0].payload.target} g`}</p>
          )
        }
        {
          payload[0].payload.over <= 0 && (
            <p className="label-under">{`余剰 : ${payload[0].payload.target - payload[0].payload.achievement} g`}</p>
          )
        }
      </div>
    );
  }

  return null;
};

export default TodaysInfo;
