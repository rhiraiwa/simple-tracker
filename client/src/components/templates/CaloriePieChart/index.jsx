import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import './index.scss';

const CaloriePieChart = ({ calorie, limit, bmr }) => {
  // const DIET_CALORIE = limit - 300;
  const DIET_CALORIE = bmr;
  const RADIAN = Math.PI / 180;

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const cx = screenWidth / 2;
  const cy = screenHeight / 5.5;
  const iR = screenWidth / 2.5 - 30;
  const oR = screenWidth / 2.5 - 28;

  const cellData = Array.from({ length: 3 }, (_, index) => ({
    value: Math.round(limit / 3),
    line: Math.round(limit / 3) * (2 * index + 1) / 2,
  }));

  const mainColor = "#a4c4e1";
  const needleColor = "#ff9999";
  const auxiliaryColor = "#ccc";

  const renderNeedle = (value, color, isMain) => {
    const total = cellData.reduce((acc, v) => acc + v.value, 0);
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = isMain ? 5 : 2;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;
    const yc = y0 - length * 0.5;
    const xmin = x0 - length;
    const xmax = x0 + length;

    if (isNaN(xba)) return null;

    return (
      <>
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
        <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />
        {isMain ? (
          <>
            <text className='calorie-value' x={x0} y={yc} textAnchor="middle" fill="#f1d6df">{`${value.toLocaleString()} kcal`}</text>
            <text x={xmin - 5} y={y0} textAnchor="end" fill={mainColor}>0</text>
            <text x={xmin} y={y0 - 2} textAnchor="start" fill={mainColor}>_</text>
            <text className='calorie-label' x={xmax + 5} y={y0-16} textAnchor="start" fill={mainColor}>活動代謝</text>
            <text x={xmax + 5} y={y0} textAnchor="start" fill={mainColor}>{limit.toLocaleString()}</text>
            <text x={xmax} y={y0 - 2} textAnchor="end" fill={mainColor}>_</text>
          </>
        ) : (
          <>
          <text className='calorie-label' x={xp + 5} y={yp-16} textAnchor="start" fill={auxiliaryColor}>基礎代謝</text>
          <text x={xp + 5} y={yp} textAnchor="start" fill={auxiliaryColor}>{DIET_CALORIE.toLocaleString()}</text>
          </>
        )}
      </>
    );
  };

  const renderCustomizedLabelLine = ({ cx, cy, midAngle, outerRadius }) => {
    const startRadius = outerRadius;
    const endRadius = outerRadius - 12;
    const startX = cx + startRadius * Math.cos(-midAngle * RADIAN);
    const startY = cy + startRadius * Math.sin(-midAngle * RADIAN);
    const endX = cx + endRadius * Math.cos(-midAngle * RADIAN);
    const endY = cy + endRadius * Math.sin(-midAngle * RADIAN);

    return <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={mainColor} />;
  };

  return (
    <ResponsiveContainer width="100%">
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={cellData}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill={mainColor}
          stroke="none"
          labelLine={false}
          label={renderCustomizedLabelLine}
          isAnimationActive={false}
        >
          {cellData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={mainColor} />
          ))}
        </Pie>
        {renderNeedle(DIET_CALORIE, auxiliaryColor, false)}
        {renderNeedle(calorie, needleColor, true)}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CaloriePieChart;
