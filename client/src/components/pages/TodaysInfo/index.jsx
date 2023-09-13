import React, { useEffect, useState } from 'react';
import { baseUri } from '../../../const';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import Header from '../../organisms/Header';
import Footer from '../../organisms/Footer';
import edit from '../../../img/edit_primary_blue.png';
import './index.scss';
import Modal from '../../molecules/Modal';
import MessageBox from '../../organisms/MessageBox';

const TodaysInfo = () => {

  const [yearMonthDate, setYearMonthDate] = useState('');

  const [todaysCalorie, setTodaysCalorie] = useState(0);
  const [todaysProtein, setTodaysProtein] = useState(0);
  const [todaysFat, setTodaysFat] = useState(0);
  const [todaysCarbohydrate, setTodaysCarbohydrate] = useState(0);
  const [foodList, setFoodList] = useState([]);

  const [limit, setLimit] = useState(0);
  const diet = 230; // 1ヶ月で1kg痩せる

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const getToday = async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = ('0'+(today.getMonth()+1)).slice(-2);
      const dd = ('0'+(today.getDate())).slice(-2);
  
      setYearMonthDate(`${yyyy}/${mm}/${dd}`);
    }

    const calcLimit = async (weight) => {
      //（9.247×体重kg＋3.098×身長cm−4.33×年齢+447.593）基礎代謝 * 軽い運動
      let wLimit =Math.round(((9.247*weight) + (3.098*161.5) - (4.33*30) +447.593) * 1.375 )
      // 基礎代謝基準値・身体活動レベルが固定
      // let wLimit = Math.round((21.9 * weight * 1.5) - 230);
      // let wLimit = Math.round(21.9 * weight * 1.5);
      setLimit(wLimit);
    }

    const fetchData = async () => {
      
      getToday();

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

    fetchData();
  },[])

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const RADIAN = Math.PI / 180;
  const calorie = [
    { name: 'sectionOne', value: Math.round(limit/3), line: Math.round(limit/6),  color: '#a4c4e1' },
    { name: 'sectionTwo', value: Math.round(limit/3), line: Math.round(limit/2), color: '#a4c4e1' },
    { name: 'sectionThree', value: Math.round(limit/3), line: Math.round(limit*5/6), color: '#a4c4e1' }
  ];
  const cx = screenWidth / 2;
  const cy = screenHeight / 5.5;
  const iR = screenWidth / 2.5 - 30;
  const oR = screenWidth / 2.5 - 28;
  const value = todaysCalorie; // ニードルの位置を示す値

  const needle = (value, data, width, cx, cy, iR, oR, color, isMain) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = width;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;
    const yc = y0 - length * 0.5;
    const xmin = x0-length;
    const xmax = x0+length;
    
    if (isNaN(xba)) return null;

    return (
      <>
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />
        {
          isMain ? (
            <>
              <text className='calorie-value' x={x0} y={yc} textAnchor="middle" fill="#f1d6df" >{`${todaysCalorie.toLocaleString()} kcal`}</text>
              <text className='' x={xmin-5} y={y0} textAnchor="end" fill="#a4c4e1" >{0}</text>
              <text className='' x={xmin} y={y0-2} textAnchor="start" fill="#a4c4e1" >_</text>
              <text className='' x={xmax+5} y={y0} textAnchor="start" fill="#a4c4e1" >{limit.toLocaleString()}</text>
              <text className='' x={xmax} y={y0-2} textAnchor="end" fill="#a4c4e1" >_</text>
            </>
          ) :
            <text className='' x={xp+5} y={yp} textAnchor="start" fill="#ccc" >{(limit-diet).toLocaleString()}</text>
        }
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
    const endRadius = outerRadius - 15; // ラベルラインの終点をセルの外側に設定する値
    const startX = cx + startRadius * Math.cos(-midAngle * (Math.PI / 180)) ;
    const startY = cy + startRadius * Math.sin(-midAngle * (Math.PI / 180)) ;
    const endX = cx + endRadius * Math.cos(-midAngle * (Math.PI / 180)) ;
    const endY = cy + endRadius * Math.sin(-midAngle * (Math.PI / 180)) ;
  
    return (
      <>
        <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#a4c4e1" />
        {/* <text x={endX} y={endY} dy={-15} textAnchor="middle" fill="#a4c4e1">
          {payload.payload.line}
        </text> */}
      </>
    );
  };

  const callBackMethod = () => {
    setModalContent(<MessageBox message={'更新しました'} closeMethod={()=>window.location.reload()}/>);
  }

  const openEditModal = (food) => {
    setIsOpen(true);
    setModalContent(<EditContent values={food} closeMethod={()=>setIsOpen(false)} callBackMethod={callBackMethod}/>);
  }

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
              {needle(limit-diet, calorie, 2, cx, cy, iR, oR, '#ccc', false)}
              {needle(value, calorie, 5, cx, cy, iR, oR, '#ff9999', true)}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='pfc-responsive-container'>
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
                {/* <th className='col-img'></th> */}
              </tr>
            </thead>
            <tbody>
              {
                foodList.map((food, index) => (
                  <tr key={index} onClick={ () => openEditModal(food) }>
                    <td className='col-note'>{food.note}</td>
                    <td className='col-calorie'>{food.calorie}</td>
                    <td className='col-pfc'>{food.protein}</td>
                    <td className='col-pfc'>{food.fat}</td>
                    <td className='col-pfc'>{food.carbohydrate}</td>
                    {/* <td className='col-img'>
                      <img className='food-history__img' src={ edit } alt='edit'/>
                    </td> */}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {
          isOpen && (
            <Modal>
              {modalContent}
            </Modal>
          )
        }
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

const EditContent = ({values, closeMethod, callBackMethod}) => {
  const id = values.id;
  const [calorie, setCalorie] = useState(values.calorie);
  const [protein, setProtein] = useState(values.protein);
  const [fat, setFat] = useState(values.fat);
  const [carbohydrate, setCarbohydrate] = useState(values.carbohydrate);
  const [note, setNote] = useState(values.note);

  const handleCalorie = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setCalorie(value);
  }

  const handleProtein = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setProtein(value);
  }

  const handleFat = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setFat(value);
  }

  const handleCarbohydrate = (e) => {
    const value = e.target.value;

    // より詳細な入力チェックを入るつもり（.xxとか）
    if (value.replace('.', '').length > 6) return;
    setCarbohydrate(value);
  }

  const handleNote = (e) => {
    const value = e.target.value;

    if (value.length > 200) {
      alert('上限200文字です');
      return;
    }

    setNote(value);
  }

  const submitPFC = async () => {
    try {
      await fetch(`${baseUri}/pfcUpdate`, {
        credentials:'include',
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: id,
          calorie: calorie,
          protein: protein !== null ? protein : '',
          fat: fat !== null ? fat : '',
          carbohydrate: carbohydrate !== null ? carbohydrate : '',
          note: note !== null ? note : ''
        })
      });

    } catch (error) {
      console.error('Fetch error:', error);
    }

    callBackMethod();
  }

  return (
    <div className='edit-pfc-modal'>
      <div className='modal-row'>
        <input className='modal-row__input' type='text' value={note} onChange={handleNote}/>
      </div>
      <div className='modal-row'>
        <label className='modal-row__label'>カロリー：</label>
        <input className='modal-row__input--number' type='number' value={calorie} onChange={handleCalorie}/>
      </div>
      <div className='modal-row'>
        <label className='modal-row__label'>P：</label>
        <input className='modal-row__input--number' type='number' value={protein} onChange={handleProtein}/>
      </div>
      <div className='modal-row'>
        <label className='modal-row__label'>F：</label>
        <input className='modal-row__input--number' type='number' value={fat} onChange={handleFat}/>
      </div>
      <div className='modal-row'>
        <label className='modal-row__label'>C：</label>
        <input className='modal-row__input--number' type='number' value={carbohydrate} onChange={handleCarbohydrate}/>
      </div>
      <div className='modal-row'>
        <button className='modal-row__button' onClick={ submitPFC }>変更</button>
        <button className='modal-row__button--cancel' onClick={ closeMethod }>キャンセル</button>
      </div>
    </div>
  );
};

export default TodaysInfo;
