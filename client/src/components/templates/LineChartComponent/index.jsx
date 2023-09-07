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

const LineChartComponent = ({ data, dataKey1, dataKey2, dataKey3, isPrivacyMode }) => {
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
        <YAxis className='y-axis' mirror={true} tick={isPrivacyMode? 0 : 1} domain='auto'/>
        <CartesianGrid strokeDasharray="3 3" />
        {
          !isPrivacyMode && (
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

    return (
      <div className="custom-tooltip">
        <p className="label-date">{`${formatTimestamp(payload[0].payload.date)}`}</p>
        <p className="label-calorie">{`${payload[0].name} : ${payload[0].value}`}</p>
        <p className="label-pfc">{`protein : ${payload[0].payload.protein}`}</p>
        <p className="label-pfc">{`fat : ${payload[0].payload.fat}`}</p>
        <p className="label-pfc">{`carbohydrate : ${payload[0].payload.carbohydrate}`}</p>
      </div>
    );
  }

  return null;
};

export default LineChartComponent;
