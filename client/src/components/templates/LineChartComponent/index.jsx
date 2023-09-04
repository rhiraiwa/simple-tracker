import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import './index.scss';

// 日本時間を表すタイムゾーンオフセット（UTC+9）
const japanTimeZoneOffset = 9 * 60 * 60 * 1000; // ミリ秒単位

// ミリ秒から日付文字列に変換する関数
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const LineChartComponent = ({ data, dataKey1, dataKey2, dataKey3 }) => {
  // データを取得する前にDateオブジェクトに変換
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).getTime() + japanTimeZoneOffset, // 日付をミリ秒に変換 + 日本時間を反映
    formattedDate: new Date(item.date).toISOString().split('T')[0], // 日付をフォーマット
  }));

  const [minX, setMinX] = useState(null);
  const [maxX, setMaxX] = useState(null);

  useEffect(() => {
    if (data.length === 0) return;

    // 最小値と最大値の初期値を設定
    let minDate = formattedData[0].date;
    let maxDate = formattedData[0].date;

    // データ内の最小値と最大値を計算
    formattedData.forEach(item => {
      minDate = Math.min(minDate, item.date);
      maxDate = Math.max(maxDate, item.date);
    });

    // 3日前と3日後の日付を計算
    const threeDays = 3 * 24 * 60 * 60 * 1000; // 3日分のミリ秒数
    const startDate = minDate - threeDays + japanTimeZoneOffset;
    const endDate = maxDate + threeDays + japanTimeZoneOffset;
    
    // 範囲を設定
    setMinX(startDate);
    setMaxX(endDate);
  }, [data, formattedData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData}>
        <XAxis
          dataKey="date"
          domain={[minX, maxX]}
          type="number"
          tickFormatter={formatTimestamp} // X軸のティックを日付形式にフォーマット
        />
        <YAxis className="y-axis" mirror={true} domain='auto'/>
        <CartesianGrid strokeDasharray="3 3" />
        {
          dataKey1 === 'calorie' ? (
            <Tooltip content={CustomTooltip} active={data !== null} payload={data} />
          ) : (
            <Tooltip
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toISOString().split('T')[0];
              }}
            />
          )
        }
        <Legend verticalAlign="bottom" />
        <Line type="monotone" dataKey={dataKey1} stroke="#a4c4e1" isAnimationActive={false} />
        {dataKey2 !== '' && (
          <Line type="monotone" dataKey={dataKey2} stroke="#f1d6df" isAnimationActive={false} />
        )}
        {dataKey3 !== '' && (
          <Line type="monotone" dataKey={dataKey3} stroke="#a4e1a9" isAnimationActive={false} dot={false}/>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {

    const RADIAN = Math.PI / 180;
    const calorie = [
      { name: '目的', value: 1500, color: '#a4c4e1' } // 目的の摂取カロリー
      // { name: '実際', value: 45, color: '#00ff00' }, // 実際の摂取カロリー
    ];
    const cx = 95;
    const cy = 50;
    const iR = 50;
    const oR = 55;
    const value = payload[0].value; // ニードルの位置を示す値

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

      return [
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />,
      ];
    };

    const maxValues = {
      // calorie: 1500,
      P: 60,
      F: 45,
      C: 180
    };

    const data = [
      // {category: 'calorie', value: payload[0].value / maxValues['calorie']},
      {category: 'P', value: payload[0].payload.protein / maxValues['P']},
      {category: 'F', value: payload[0].payload.fat / maxValues['F']},
      {category: 'C', value: payload[0].payload.carbohydrate / maxValues['C']}
    ]

    return (
      <div className="custom-tooltip">
        <p className="label-date">{`${formatTimestamp(payload[0].payload.date)}`}</p>
        <p className="label-calorie">{`${payload[0].name} : ${payload[0].value}`}</p>
        
        <PieChart width={200} height={80}>
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
          >
            {calorie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {needle(value, calorie, cx, cy, iR, oR, '#ff9999')}
        </PieChart>

        <p className="label-pfc">{`protein : ${payload[0].payload.protein}`}</p>
        <p className="label-pfc">{`fat : ${payload[0].payload.fat}`}</p>
        <p className="label-pfc">{`carbohydrate : ${payload[0].payload.carbohydrate}`}</p>
        <RadarChart width={200} height={200} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 1]} />
          {/* <PolarRadiusAxis angle={30} /> */}
          <Radar name="Value" dataKey="value" stroke="#f1d6df" fill="#f1d6df" fillOpacity={0.6} isAnimationActive={ false }/>
        </RadarChart>
      </div>
    );
  }

  return null;
};

export default LineChartComponent;
