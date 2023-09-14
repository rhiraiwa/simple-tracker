import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import './index.scss';

const PFCBarChart = ({p, f, c}) => {
  const data = [
    { category: 'P（タンパク質）', target: 60, achievement: p },
    { category: 'F（脂質）', target: 45, achievement: f },
    { category: 'C（炭水化物）', target: 180, achievement: c },
  ];

  const chartData = data.map((entry) => ({
    category: entry.category,
    target: entry.target,
    achievement: entry.achievement,
    result: entry.achievement > entry.target ? 100 : 100 - (entry.target - entry.achievement) * 100 / entry.target,
    over: entry.achievement > entry.target ? (entry.achievement - entry.target) * 100 / entry.target : 0,
    under: entry.achievement > entry.target ? 0 : (entry.target - entry.achievement) * 100 / entry.target
  }));

  return (
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
  )
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

export default PFCBarChart;